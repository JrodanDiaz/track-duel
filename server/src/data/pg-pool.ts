import { Pool} from "pg";
export const pg_pool = new Pool({
  host: "db",
  user: "postgres",
  password: "secret",
  // connectionTimeoutMillis: 7000
});

pg_pool.on('error', (err: Error) => {
  console.log(`pg pool fucked up: ${err}`);
}) 