import { access, copyFile, mkdir, readdir, unlink } from "node:fs/promises";
import { join, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

const root = process.cwd();
const dataDir = resolve(process.env.DATA_DIR || join(root, "data"));
const dbPath = resolve(process.env.DB_PATH || join(dataDir, "factory.sqlite"));
const backupDir = resolve(process.env.BACKUP_DIR || join(root, "backups"));
const keep = Math.max(1, Number(process.env.BACKUP_KEEP || 30));

await mkdir(backupDir, { recursive: true });

try {
  await access(dbPath);
} catch {
  throw new Error(`database not found: ${dbPath}`);
}

const db = new DatabaseSync(dbPath);
db.exec("PRAGMA wal_checkpoint(TRUNCATE)");
db.close();

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const target = join(backupDir, `factory-${stamp}.sqlite`);
await copyFile(dbPath, target);

const files = (await readdir(backupDir))
  .filter((name) => /^factory-.+\.sqlite$/.test(name))
  .sort()
  .reverse();

for (const file of files.slice(keep)) {
  await unlink(join(backupDir, file));
}

console.log(`backup created: ${target}`);
