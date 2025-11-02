import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function openDb() {
  return open({
    filename: "./users.db",
    driver: sqlite3.Database
  });
}

// Buat tabel user jika belum ada
export async function initDb() {
  const db = await openDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      password TEXT,
      expired_at TEXT,
      device_limit INTEGER DEFAULT 1,
      devices TEXT DEFAULT '[]'
    )
  `);
                }
