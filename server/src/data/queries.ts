import { pg_pool } from "./pg-pool";
import { UserCredentials, ErrorMessage } from "../types";

export const getUsers = async (): Promise<any[] | ErrorMessage> => {
  const users = await pg_pool.query("SELECT * FROM users");
  if(users.rows.length === 0) return {errorMessage: "Users table is empty"}
  return users.rows;
};

export const findByUsername = async (username: string): Promise<UserCredentials | ErrorMessage > => {
  try {
    const query = "SELECT * FROM users WHERE username = $1";
    const res = await pg_pool.query(query, [username]);
    if (res.rows.length === 0)
      return { errorMessage: "No users found with that username" };
    const user: UserCredentials = {
      username: res.rows[0].username,
      password: res.rows[0].password,
    };
    return user;
  } catch (err) {
    console.log(err);
    return { errorMessage: "Internal server error" };
  }
};

export const userExists = async (username: string): Promise<boolean> => {
  const query = "SELECT * FROM users WHERE username = $1";
  const res = await pg_pool.query(query, [username]);
  return res.rows.length !== 0;
};

export const createUser = async (user: UserCredentials) => {
  const res = await pg_pool.query(
    "INSERT INTO users (username, password) VALUES ($1, $2)",
    [user.username, user.password]
  );
};

export const getUserIdFromUsername = async (
  username: string
): Promise<string> => {
  const res = await pg_pool.query(
    "SELECT id FROM users WHERE username = $1",
    [username]
  );
  if (res.rows[0].length === 0) return "";
  return res.rows[0].id as string;
};

export const createTable = async () => {
  try {
    const res = await pg_pool.query(
      "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, username VARCHAR(100) NOT NULL, password VARCHAR(100) NOT NULL)"
    );
  } catch (err) {
    console.log(err);
  }
};

export const clearTable = async () => {
  try {
    await pg_pool.query("DELETE FROM users");
  } catch(err){
    console.log(`err occurred in clearTable: ${err}`);
    
  }
}
