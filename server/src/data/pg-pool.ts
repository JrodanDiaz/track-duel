import { Pool} from "pg";
export const pg_pool = new Pool({
  host: "db",
  user: "postgres",
  password: "secret",
  database: "db",
});

pg_pool.on('error', (err: Error) => {
  console.log(`pg pool fucked up: ${err}`);
}) 