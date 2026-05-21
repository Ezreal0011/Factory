import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { readFile, mkdir } from "node:fs/promises";
import { createHmac, pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";
import { extname, join, normalize, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

const root = process.cwd();
loadEnvFile(join(root, ".env"));
const port = Number(process.env.PORT || 5174);
const host = process.env.HOST || "0.0.0.0";
const dataDir = resolve(process.env.DATA_DIR || join(root, "data"));
const dbPath = resolve(process.env.DB_PATH || join(dataDir, "factory.sqlite"));
const sessionSecret = process.env.SESSION_SECRET || "factory-dev-change-me";
const secureCookies = process.env.COOKIE_SECURE === "true";
const sessionMaxAgeMs = Number(process.env.SESSION_MAX_AGE_MS || 1000 * 60 * 60 * 24 * 14);
const gameVersion = process.env.GAME_VERSION || "0.1.0";
const saveVersion = 2;
const adminUsername = process.env.ADMIN_USERNAME ? normalizeUsername(process.env.ADMIN_USERNAME) : "";
const adminPassword = process.env.ADMIN_PASSWORD || "";

const types = {
  ".html": "text/html;charset=utf-8",
  ".css": "text/css;charset=utf-8",
  ".js": "text/javascript;charset=utf-8",
  ".json": "application/json;charset=utf-8",
  ".md": "text/plain;charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml"
};

function loadEnvFile(file) {
  try {
    const lines = readFileSync(file, "utf8").split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const index = trimmed.indexOf("=");
      if (index < 1) continue;
      const key = trimmed.slice(0, index).trim();
      const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // .env is optional; deployment platforms can provide environment variables directly.
  }
}

await mkdir(dataDir, { recursive: true });
const db = new DatabaseSync(dbPath);
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'player',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_at TEXT
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS saves (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    save_version INTEGER NOT NULL DEFAULT 1,
    game_version TEXT NOT NULL DEFAULT '0.1.0',
    summary TEXT NOT NULL DEFAULT '',
    data_json TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_saves_user_updated ON saves(user_id, updated_at DESC);
  CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
`);

ensureColumn("users", "role", "TEXT NOT NULL DEFAULT 'player'");

const statements = {
  createUser: db.prepare("INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)"),
  updateAdminUser: db.prepare("UPDATE users SET password_hash = ?, role = 'admin' WHERE username = ?"),
  findUser: db.prepare("SELECT id, username, password_hash, role, created_at, last_login_at FROM users WHERE username = ?"),
  userById: db.prepare("SELECT id, username, role, created_at, last_login_at FROM users WHERE id = ?"),
  touchLogin: db.prepare("UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?"),
  createSession: db.prepare("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)"),
  sessionByHash: db.prepare(`
    SELECT sessions.expires_at, users.id, users.username, users.role, users.created_at, users.last_login_at
    FROM sessions
    JOIN users ON users.id = sessions.user_id
    WHERE sessions.token_hash = ?
  `),
  deleteSession: db.prepare("DELETE FROM sessions WHERE token_hash = ?"),
  cleanupSessions: db.prepare("DELETE FROM sessions WHERE expires_at <= ?"),
  listSaves: db.prepare(`
    SELECT id, name, save_version, game_version, summary, created_at, updated_at
    FROM saves
    WHERE user_id = ?
    ORDER BY updated_at DESC
  `),
  getSave: db.prepare("SELECT * FROM saves WHERE id = ? AND user_id = ?"),
  createSave: db.prepare(`
    INSERT INTO saves (user_id, name, save_version, game_version, summary, data_json, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `),
  updateSave: db.prepare(`
    UPDATE saves
    SET name = ?, save_version = ?, game_version = ?, summary = ?, data_json = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND user_id = ?
  `),
  deleteSave: db.prepare("DELETE FROM saves WHERE id = ? AND user_id = ?")
};

if (adminUsername && adminPassword) {
  const existingAdmin = statements.findUser.get(adminUsername);
  if (!existingAdmin) {
    statements.createUser.run(adminUsername, hashPassword(adminPassword), "admin");
    console.log(`admin user created: ${adminUsername}`);
  } else {
    statements.updateAdminUser.run(hashPassword(adminPassword), adminUsername);
    console.log(`admin user updated: ${adminUsername}`);
  }
}

function ensureColumn(table, column, definition) {
  const safeTable = String(table).replace(/[^a-z0-9_]/gi, "");
  const safeColumn = String(column).replace(/[^a-z0-9_]/gi, "");
  if (!safeTable || !safeColumn) throw new Error("invalid migration identifier");
  const columns = db.prepare(`PRAGMA table_info(${safeTable})`).all().map((row) => row.name);
  if (!columns.includes(safeColumn)) {
    db.exec(`ALTER TABLE ${safeTable} ADD COLUMN ${safeColumn} ${definition}`);
    console.log(`database migrated: ${safeTable}.${safeColumn}`);
  }
}

function json(response, status, body, extraHeaders = {}) {
  response.writeHead(status, { "Content-Type": "application/json;charset=utf-8", ...extraHeaders });
  response.end(JSON.stringify(body));
}

function parseCookies(header = "") {
  return Object.fromEntries(header.split(";").map((part) => {
    const index = part.indexOf("=");
    if (index < 0) return null;
    return [part.slice(0, index).trim(), decodeURIComponent(part.slice(index + 1).trim())];
  }).filter(Boolean));
}

function cookieHeader(name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`, "Path=/", "HttpOnly", "SameSite=Lax"];
  if (secureCookies) parts.push("Secure");
  if (options.maxAge !== undefined) parts.push(`Max-Age=${Math.max(0, Math.floor(options.maxAge))}`);
  return parts.join("; ");
}

function signToken(token) {
  return createHmac("sha256", sessionSecret).update(token).digest("hex");
}

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 210000, 32, "sha256").toString("hex");
  return `pbkdf2$${salt}$${hash}`;
}

function verifyPassword(password, stored) {
  const [method, salt, expected] = String(stored || "").split("$");
  if (method !== "pbkdf2" || !salt || !expected) return false;
  const actual = pbkdf2Sync(password, salt, 210000, 32, "sha256");
  const expectedBytes = Buffer.from(expected, "hex");
  return expectedBytes.length === actual.length && timingSafeEqual(expectedBytes, actual);
}

function publicUser(user) {
  return user ? {
    id: user.id,
    username: user.username,
    role: user.role,
    createdAt: user.created_at,
    lastLoginAt: user.last_login_at
  } : null;
}

async function readJson(request) {
  let raw = "";
  for await (const chunk of request) {
    raw += chunk;
    if (raw.length > 20 * 1024 * 1024) throw Object.assign(new Error("payload too large"), { status: 413 });
  }
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    throw Object.assign(new Error("invalid json"), { status: 400 });
  }
}

function normalizeUsername(username) {
  return String(username || "").trim().toLowerCase();
}

function validateCredentials(username, password) {
  if (!/^[a-z0-9_@.-]{3,32}$/.test(username)) {
    return "账号需要 3-32 位，只能包含字母、数字、下划线、点、横线或 @";
  }
  if (String(password || "").length < 6 || String(password || "").length > 72) {
    return "密码需要 6-72 位";
  }
  return "";
}

function createSession(response, userId) {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = signToken(token);
  const expiresAt = Date.now() + sessionMaxAgeMs;
  statements.createSession.run(tokenHash, userId, expiresAt);
  response.setHeader("Set-Cookie", cookieHeader("factory_session", token, { maxAge: sessionMaxAgeMs / 1000 }));
}

function currentUser(request) {
  const token = parseCookies(request.headers.cookie).factory_session;
  if (!token) return null;
  const session = statements.sessionByHash.get(signToken(token));
  if (!session || session.expires_at <= Date.now()) return null;
  return session;
}

function requireUser(request, response) {
  const user = currentUser(request);
  if (!user) {
    json(response, 401, { error: "请先登录" });
    return null;
  }
  return user;
}

function saveSummary(data = {}) {
  const nodes = Array.isArray(data.nodes) ? data.nodes.length : 0;
  const links = (Array.isArray(data.links) ? data.links.length : 0) + (Array.isArray(data.powerLinks) ? data.powerLinks.length : 0);
  const cores = Math.floor(data.productionStats?.mechanical_core || 0);
  return `${nodes} 节点 / ${links} 连线 / 机械核心 ${cores}`;
}

function migrateSaveData(data) {
  const migrated = structuredClone(data || {});
  let version = Number(migrated.saveVersion || 1);
  if (version < 1) version = 1;
  if (version === 1) {
    migrated.claimedGoalRewards ||= {};
    migrated.completedGoalSteps ||= {};
    migrated.productionStats ||= {};
    migrated.logisticsPeak ||= 0;
    migrated.cableStock ??= 12;
    migrated.completed = Boolean(migrated.completed);
    version = 2;
  }
  migrated.saveVersion = saveVersion;
  migrated.gameVersion ||= gameVersion;
  return migrated;
}

function saveRow(row, includeData = false) {
  const data = includeData ? migrateSaveData(JSON.parse(row.data_json)) : undefined;
  return {
    id: String(row.id),
    name: row.name,
    saveVersion: row.save_version,
    gameVersion: row.game_version,
    summary: row.summary,
    savedAt: new Date(row.updated_at).getTime(),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    ...(includeData ? { data } : {})
  };
}

async function handleApi(request, response, pathname) {
  statements.cleanupSessions.run(Date.now());

  if (pathname === "/api/health") {
    json(response, 200, { ok: true, gameVersion, saveVersion });
    return;
  }

  if (pathname === "/api/me" && request.method === "GET") {
    json(response, 200, { user: publicUser(currentUser(request)), gameVersion, saveVersion });
    return;
  }

  if (pathname === "/api/auth/register" && request.method === "POST") {
    const body = await readJson(request);
    const username = normalizeUsername(body.username);
    const password = String(body.password || "");
    const error = validateCredentials(username, password);
    if (error) return json(response, 400, { error });
    try {
      const result = statements.createUser.run(username, hashPassword(password), "player");
      createSession(response, Number(result.lastInsertRowid));
      const user = statements.userById.get(Number(result.lastInsertRowid));
      json(response, 201, { user: publicUser(user) });
    } catch (error) {
      json(response, 409, { error: "账号已存在" });
    }
    return;
  }

  if (pathname === "/api/auth/login" && request.method === "POST") {
    const body = await readJson(request);
    const username = normalizeUsername(body.username);
    const password = String(body.password || "");
    const user = statements.findUser.get(username);
    if (!user || !verifyPassword(password, user.password_hash)) {
      return json(response, 401, { error: "账号或密码错误" });
    }
    statements.touchLogin.run(user.id);
    createSession(response, user.id);
    json(response, 200, { user: publicUser(statements.userById.get(user.id)) });
    return;
  }

  if (pathname === "/api/auth/logout" && request.method === "POST") {
    const token = parseCookies(request.headers.cookie).factory_session;
    if (token) statements.deleteSession.run(signToken(token));
    json(response, 200, { ok: true }, { "Set-Cookie": cookieHeader("factory_session", "", { maxAge: 0 }) });
    return;
  }

  if (pathname === "/api/admin/gm-session" && request.method === "GET") {
    const user = requireUser(request, response);
    if (!user) return;
    if (user.role !== "admin") return json(response, 403, { error: "没有 GM 权限" });
    json(response, 200, { ok: true, user: publicUser(user) });
    return;
  }

  if (pathname === "/api/saves" && request.method === "GET") {
    const user = requireUser(request, response);
    if (!user) return;
    json(response, 200, { saves: statements.listSaves.all(user.id).map((row) => saveRow(row)) });
    return;
  }

  if (pathname === "/api/saves" && request.method === "POST") {
    const user = requireUser(request, response);
    if (!user) return;
    const body = await readJson(request);
    const data = migrateSaveData(body.data || {});
    const name = String(body.name || "未命名存档").trim().slice(0, 32) || "未命名存档";
    const summary = String(body.summary || saveSummary(data)).slice(0, 200);
    const result = statements.createSave.run(user.id, name, saveVersion, gameVersion, summary, JSON.stringify(data));
    const row = statements.getSave.get(Number(result.lastInsertRowid), user.id);
    json(response, 201, { save: saveRow(row, true) });
    return;
  }

  const saveMatch = pathname.match(/^\/api\/saves\/(\d+)$/);
  if (saveMatch) {
    const user = requireUser(request, response);
    if (!user) return;
    const id = Number(saveMatch[1]);
    if (request.method === "GET") {
      const row = statements.getSave.get(id, user.id);
      if (!row) return json(response, 404, { error: "存档不存在" });
      json(response, 200, { save: saveRow(row, true) });
      return;
    }
    if (request.method === "PUT") {
      const row = statements.getSave.get(id, user.id);
      if (!row) return json(response, 404, { error: "存档不存在" });
      const body = await readJson(request);
      const data = migrateSaveData(body.data || {});
      const name = String(body.name || row.name).trim().slice(0, 32) || row.name;
      const summary = String(body.summary || saveSummary(data)).slice(0, 200);
      statements.updateSave.run(name, saveVersion, gameVersion, summary, JSON.stringify(data), id, user.id);
      json(response, 200, { save: saveRow(statements.getSave.get(id, user.id), true) });
      return;
    }
    if (request.method === "DELETE") {
      statements.deleteSave.run(id, user.id);
      json(response, 200, { ok: true });
      return;
    }
  }

  json(response, 404, { error: "API 不存在" });
}

async function serveStatic(request, response, pathname) {
  let route = pathname;
  if (route === "/") route = "/index.html";
  const file = normalize(join(root, route));
  if (!file.startsWith(root)) throw new Error("outside root");
  const body = await readFile(file);
  response.writeHead(200, {
    "Content-Type": types[extname(file)] || "application/octet-stream",
    "Cache-Control": extname(file) === ".html" ? "no-cache" : "public, max-age=300"
  });
  response.end(body);
}

createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
    if (url.pathname.startsWith("/api/")) {
      await handleApi(request, response, url.pathname);
      return;
    }
    await serveStatic(request, response, decodeURIComponent(url.pathname));
  } catch (error) {
    const status = error.status || 500;
    if (request.url?.startsWith("/api/")) {
      json(response, status, { error: status === 500 ? "服务器错误" : error.message });
    } else {
      response.writeHead(status === 500 ? 404 : status, { "Content-Type": "text/plain;charset=utf-8" });
      response.end(status === 500 ? "not found" : error.message);
    }
  }
}).listen(port, host, () => {
  console.log(`factory server running at http://${host}:${port}`);
  console.log(`database: ${dbPath}`);
});
