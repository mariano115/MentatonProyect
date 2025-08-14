import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DB_NAME = 'questions.db';
const DB_VERSION = 3; // Incrementa este número cada vez que actualices el archivo .db
const DB_VERSION_KEY = 'questions_db_version';

export async function openDatabase(): Promise<SQLite.SQLiteDatabase> {
  const dbPath = `${FileSystem.documentDirectory}SQLite/${DB_NAME}`;
  console.log('[DB] dbPath:', dbPath);

  const fileInfo = await FileSystem.getInfoAsync(dbPath);
  const storedVersion = parseInt(await AsyncStorage.getItem(DB_VERSION_KEY) || '0', 10);

  console.log('[DB] fileInfo.exists:', fileInfo.exists, 'storedVersion:', storedVersion, 'assetVersion:', DB_VERSION);

  if (!fileInfo.exists || storedVersion < DB_VERSION) {
    console.log('[DB] Copiando base de datos desde assets...');
    await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}SQLite`, { intermediates: true });

    const asset = Asset.fromModule(require('../assets/database/questions.db'));
    await asset.downloadAsync();
    console.log('[DB] Asset descargado:', asset.localUri);

    if (fileInfo.exists) {
      await FileSystem.deleteAsync(dbPath, { idempotent: true });
      console.log('[DB] Base de datos antigua eliminada');
    }

    await FileSystem.copyAsync({
      from: asset.localUri!,
      to: dbPath,
    });
    console.log('[DB] Copia completada');
    await AsyncStorage.setItem(DB_VERSION_KEY, DB_VERSION.toString());
    console.log('[DB] Versión actualizada en AsyncStorage');
  } else {
    console.log('[DB] La base de datos ya existe y está actualizada');
  }

  const db = await SQLite.openDatabaseAsync(DB_NAME);
  console.log('[DB] Base de datos abierta');

  // Normalizar datos (solo la primera vez)
  await normalizeData(db);

  return db;
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
    console.log('[DB] Datos normalizados');
  } catch (err) {
    console.error('Error normalizando la base:', err);
  }
}
