import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DB_NAME = "questions.db";
const DB_VERSION_KEY = "questions_db_version";

// Remote JSON endpoints (raw GitHub as example). Cambia por tu hosting si hace falta.
const REMOTE_VERSION_URL =
  "https://raw.githubusercontent.com/mariano115/MentatonDB/main/data/version.json";
const REMOTE_QUESTIONS_URL =
  "https://raw.githubusercontent.com/mariano115/MentatonDB/main/data/questions-v0.1.json";

export async function openDatabase(): Promise<SQLite.SQLiteDatabase> {
  const dbPath = `${FileSystem.documentDirectory}SQLite/${DB_NAME}`;
  console.log("[DB] dbPath:", dbPath);

  const fileInfo = await FileSystem.getInfoAsync(dbPath);
  const storedVersion = parseFloat(
    (await AsyncStorage.getItem(DB_VERSION_KEY)) || "0"
  );

  console.log(
    "[DB] fileInfo.exists:",
    fileInfo.exists,
    "storedVersion:",
    storedVersion
  );

  // 1) Try remote update flow: check remote version.json and, if newer, download JSON and populate SQLite.
  try {
    const resp = await fetch(REMOTE_VERSION_URL, { cache: "no-store" });
    if (resp.ok) {
      const remote = await resp.json();
      // remote may include: { version: "0.2", questions_url: "https://..." }
      const remoteVersion = parseFloat(remote.version || 0);
      const remoteQuestionsUrl = remote.questions_url || REMOTE_QUESTIONS_URL;
      console.log(
        "[DB] remoteVersion:",
        remoteVersion,
        "questionsUrl:",
        remoteQuestionsUrl
      );

      if (remoteVersion > storedVersion) {
        console.log(
          "[DB] Nueva versión remota disponible -> actualizar desde JSON remoto"
        );

        // Ensure directory exists and remove old DB if any
        await FileSystem.makeDirectoryAsync(
          `${FileSystem.documentDirectory}SQLite`,
          { intermediates: true }
        );
        if (fileInfo.exists) {
          try {
            await FileSystem.deleteAsync(dbPath, { idempotent: true });
            console.log(
              "[DB] Archivo local eliminado para actualización remota"
            );
          } catch (e) {
            console.warn(e);
          }
        }

        // Open (will create) DB and populate from JSON in batches
        const db = await SQLite.openDatabaseAsync(DB_NAME);

        try {
          await db.execAsync(`DROP TABLE IF EXISTS questions;`);
          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS questions (
              id INTEGER PRIMARY KEY NOT NULL,
              question TEXT,
              answer TEXT,
              category TEXT,
              difficulty TEXT,
              language TEXT
            );
          `);

          const qResp = await fetch(remoteQuestionsUrl, {
            cache: "no-store",
          });
          if (!qResp.ok) throw new Error("No se pudo descargar questions JSON");
          const questions = await qResp.json();

          await insertQuestionsInBatches(db, questions);

          await AsyncStorage.setItem(DB_VERSION_KEY, remoteVersion.toString());
          console.log(
            "[DB] Actualización remota completada, versión guardada:",
            remoteVersion
          );
        } catch (err) {
          console.error("[DB] Error volcando JSON a SQLite:", err);
        }

        // normalize and return
        await normalizeData(db);
        return db;
      }
    } else {
      console.warn(
        "[DB] No se pudo obtener versión remota, status:",
        resp.status
      );
    }
  } catch (err) {
    console.warn(
      "[DB] Error comprobando versión remota (usar fallback local):",
      err
    );
  }

  // 2) Fallback: if there's no local DB at all, copy the bundled asset so app can work offline.
  // We no longer use the bundled `DB_VERSION` to decide updates; remote `version.json` vs stored AsyncStorage is authoritative.
  // If there's no local DB and no bundled asset, create an empty DB with the expected schema so the app can run offline.
  if (!fileInfo.exists && storedVersion === 0) {
    console.log(
      "[DB] No se encontró asset .db empaquetado; creando DB vacía con esquema inicial..."
    );
    await FileSystem.makeDirectoryAsync(
      `${FileSystem.documentDirectory}SQLite`,
      {
        intermediates: true,
      }
    );

    // Crear la DB vacía y la tabla inicial
    const db = await SQLite.openDatabaseAsync(DB_NAME);
    try {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS questions (
          id INTEGER PRIMARY KEY NOT NULL,
          question TEXT,
          answer TEXT,
          category TEXT,
          difficulty TEXT,
          language TEXT
        );
      `);
      // Indicamos que tenemos una DB instalada (versión mínima)
      try {
        await AsyncStorage.setItem(DB_VERSION_KEY, "0.1");
      } catch (e) {
        console.warn(e);
      }
      console.log(
        "[DB] DB vacía creada y versión guardada en AsyncStorage (0.1)"
      );
    } catch (err) {
      console.error("[DB] Error creando DB vacía:", err);
    }
    // Normalizar y retornar DB nuevo
    await normalizeData(db);
    return db;
  } else {
    console.log("[DB] La base de datos ya existe y está actualizada");
  }

  const db = await SQLite.openDatabaseAsync(DB_NAME);
  console.log("[DB] Base de datos abierta");

  // Normalizar datos
  await normalizeData(db);

  return db;
}

async function insertQuestionsInBatches(
  db: SQLite.SQLiteDatabase,
  questions: any[],
  batchSize = 200
) {
  if (!Array.isArray(questions) || questions.length === 0) return;

  // Batch INSERT building placeholders to reduce roundtrips and improve performance
  function sqlEscape(val: any) {
    if (val === null || val === undefined) return "NULL";
    const s = val.toString();
    // escape single quotes for SQL literal
    return `'${s.replace(/'/g, "''")}'`;
  }

  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize);
    const rowsSql: string[] = [];

    for (const q of batch) {
      const id = q.id != null ? q.id : "NULL";
      const question = sqlEscape(q.question || "");
      const answer = sqlEscape(q.answer || "");
      const category = sqlEscape((q.category || "").toString().toLowerCase());
      const difficulty = sqlEscape(
        (q.difficulty || "").toString().toLowerCase()
      );
      const language = sqlEscape((q.language || "es").toString().toLowerCase());

      rowsSql.push(
        `(${id}, ${question}, ${answer}, ${category}, ${difficulty}, ${language})`
      );
    }

    const sql = `INSERT OR REPLACE INTO questions (id, question, answer, category, difficulty, language) VALUES ${rowsSql.join(
      ","
    )};`;
    try {
      await db.execAsync(sql);
    } catch (err) {
      console.error("[DB] Error insertando batch (stringified):", err);
      // Fallback: insert one by one
      for (const q of batch) {
        try {
          const id = q.id != null ? q.id : "NULL";
          const question = sqlEscape(q.question || "");
          const answer = sqlEscape(q.answer || "");
          const category = sqlEscape(
            (q.category || "").toString().toLowerCase()
          );
          const difficulty = sqlEscape(
            (q.difficulty || "").toString().toLowerCase()
          );
          const language = sqlEscape(
            (q.language || "es").toString().toLowerCase()
          );
          const single = `INSERT OR REPLACE INTO questions (id, question, answer, category, difficulty, language) VALUES (${id}, ${question}, ${answer}, ${category}, ${difficulty}, ${language});`;
          await db.execAsync(single);
        } catch (e) {
          console.warn("[DB] Fallback insert failed for item id=", q.id, e);
        }
      }
    }
  }
}

async function normalizeData(db: SQLite.SQLiteDatabase) {
  try {
    await db.execAsync(`
      UPDATE questions
      SET
        category = LOWER(category),
        difficulty = LOWER(difficulty),
        language = LOWER(language);
    `);
    console.log("[DB] Datos normalizados");
  } catch (err) {
    console.error("Error normalizando la base:", err);
  }
}
