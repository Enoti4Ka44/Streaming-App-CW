import { Pool, QueryResultRow } from "pg";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
});

export const query = <T extends QueryResultRow>(text: string, params?: any[]) =>
  pool.query<T>(text, params);

export default pool;
