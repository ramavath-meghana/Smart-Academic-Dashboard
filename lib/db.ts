import fs from "fs";
import path from "path";
import mysql from "mysql2";
import Database from "better-sqlite3";

export type DbClient = {
  query: (
    sql: string,
    params?: unknown[] | ((err: unknown, results?: unknown) => void),
    cb?: (err: unknown, results?: unknown) => void
  ) => void;
  promise: () => {
    query: (sql: string, params?: unknown[]) => Promise<[unknown]>;
  };
};

function useSqliteMode() {
  return process.env.USE_SQLITE === "true" || process.env.USE_SQLITE === "1";
}

function resolveMysqlConfig() {
  const config = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME || "smart_academic_v2",
    port: Number(process.env.DB_PORT || 3306),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };

  const mysqlUrl = String(process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL || "").trim();
  if (mysqlUrl) {
    try {
      const parsed = new URL(mysqlUrl);
      if (["mysql:", "mysql2:"].includes(parsed.protocol)) {
        config.host = parsed.hostname || config.host;
        config.port = Number(parsed.port || config.port);
        config.user = decodeURIComponent(parsed.username || config.user);
        if (parsed.password) {
          config.password = decodeURIComponent(parsed.password);
        }
        const dbName = parsed.pathname.replace(/^\//, "");
        if (dbName) config.database = dbName;
      }
    } catch {
      // Keep DB_* values when URL parsing fails.
    }
  }

  // Explicit DB_PASSWORD in .env always wins (fixes empty password in MYSQL_URL).
  if (process.env.DB_PASSWORD !== undefined && process.env.DB_PASSWORD !== "") {
    config.password = process.env.DB_PASSWORD;
  }

  return config;
}

function createMysqlDb(): DbClient {
  const config = resolveMysqlConfig();
  const pool = mysql.createPool(config);

  console.log(
    `📦 Database: MySQL (${config.user}@${config.host}:${config.port}/${config.database})`
  );
  if (!config.password) {
    console.log(
      "⚠️ DB_PASSWORD is empty. Set your MySQL password in .env, or set USE_SQLITE=true for local file DB."
    );
  }

  return pool as unknown as DbClient;
}

function createSqliteDb(): DbClient {
  const dbPath =
    process.env.SQLITE_PATH || path.join(process.cwd(), "data", "smart_academic.db");
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");

  console.log(`📦 Database: SQLite (${dbPath})`);

  const runQuery = (sql: string, params?: unknown[]) => {
    const upper = sql.trim().toUpperCase();
    const stmt = sqlite.prepare(sql);
    if (upper.startsWith("SELECT") || upper.startsWith("PRAGMA")) {
      return params?.length ? stmt.all(...params) : stmt.all();
    }
    return params?.length ? stmt.run(...params) : stmt.run();
  };

  return {
    query(sql, paramsOrCb?, cb?) {
      let params: unknown[] | undefined;
      let callback = cb;

      if (typeof paramsOrCb === "function") {
        callback = paramsOrCb;
        params = undefined;
      } else {
        params = paramsOrCb as unknown[] | undefined;
      }

      try {
        callback?.(null, runQuery(sql, params));
      } catch (err) {
        callback?.(err);
      }
    },
    promise() {
      return {
        query(sql: string, params?: unknown[]) {
          return new Promise<[unknown]>((resolve, reject) => {
            try {
              resolve([runQuery(sql, params)]);
            } catch (err) {
              reject(err);
            }
          });
        },
      };
    },
  };
}

export function createDatabase(): DbClient {
  if (useSqliteMode()) {
    return createSqliteDb();
  }
  return createMysqlDb();
}
