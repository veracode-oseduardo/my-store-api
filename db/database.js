import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { DB_FILE } from '../config.js';

const migrations = fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), 'migrations.sql'), 'utf8');
const seedSql = fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), 'seed.sql'), 'utf8');

function openDb() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const db = new Database(DB_FILE);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  return db;
}

function migrate() {
  const db = openDb();
  db.exec(migrations);
  console.log('Migrations have been applied');
  db.close();
}

function seed() {
  const db = openDb();
  // Execute seed by replacing deafult password hash 123456
  db.exec(migrations);
  //const hash = bcrypt.hashSync('123456', 10);
  //const seedWithHash = seedSql.replace(/PLACEHOLDER_HASH/g, hash);
  //db.exec(seedWithHash);
  db.exec(seedSql);
  console.log('Seed data inserted');
  db.close();
}

if (process.argv.includes('--migrate')) migrate();
if (process.argv.includes('--seed')) seed();

export function getDb() {
  return openDb();
}
