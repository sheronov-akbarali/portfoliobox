import net from "node:net";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

// Some container/sandbox network stacks break Node's parallel Happy Eyeballs
// connection attempts (used by default since Node 18). A single sequential
// attempt still works fine, so disable it globally for outbound connections.
net.setDefaultAutoSelectFamily(false);

function createDb() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
  return drizzle(pool, { schema });
}

let _db: ReturnType<typeof createDb> | null = null;

export function getDb() {
  if (!_db) _db = createDb();
  return _db;
}
