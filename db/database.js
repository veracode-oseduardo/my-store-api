import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';
import { DB_FILE } from '../config.js';

const migrations = fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), 'migrations.sql'), 'utf8');
const seedSql = fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), 'seed.sql'), 'utf8');

export async function openDb() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const db = await open({ filename: DB_FILE, driver: sqlite3.Database });
  await db.exec('PRAGMA journal_mode = WAL');
  await db.exec('PRAGMA foreign_keys = ON');
  return db;
}

export async function migrate() {
  const db = await openDb();
  await db.exec(migrations);
  console.log('Migrations have been applied');
  await db.close();
}

export async function seed() {
  const db = await openDb();
  await db.exec(migrations);
  await db.exec(seedSql);
  console.log('Seed data inserted');
  await db.close();
}

if (process.argv.includes('--migrate')) await migrate();
if (process.argv.includes('--seed')) await seed();

export async function getDb() {
  return openDb();
}
