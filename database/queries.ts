import { openDatabase } from './index';

export interface Question {
  id: number;
  question: string;
  answer: string;
  category: string;
  difficulty: string;
  language: string;
}

export async function getRandomQuestion(
  category: string,
  difficulty: string,
  language: string
): Promise<Question | null> {
  try {
    console.log('[DB] getRandomQuestion params:', {
      category,
      difficulty,
      language,
    });
    const db = await openDatabase();

    const rows = await db.getAllAsync<Question>(
      `SELECT * FROM questions 
       WHERE category = ? AND difficulty = ? AND language = ?
       ORDER BY RANDOM() LIMIT 1;`,
      [category.toLowerCase(), difficulty.toLowerCase(), language.toLowerCase()]
    );

    console.log('[DB] getRandomQuestion result:', rows);

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Error al obtener pregunta:', error);
    return null;
  }
}


