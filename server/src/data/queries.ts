import { pg_pool } from "./pg-pool";
import { UserCredentials, ErrorMessage, DB_USERS_ROW } from "../types";
import { hash, verify } from "../encryption";
import { QueryResult } from "pg";

export const getUsers = async (): Promise<any[] | ErrorMessage> => {
  try 
  {
    const users = await pg_pool.query("SELECT * FROM public.users");
    if(users.rows.length === 0) return {errorMessage: "Users table is empty"}
    return users.rows;
  } 
  catch(err) 
  {
    console.log(`err in getUsers: ${err}`);
    return {errorMessage: "Internal Server Error"}
  }
};

export const findByUsername = async (username: string): Promise<UserCredentials | ErrorMessage > => {
  try 
  {
    const query = "SELECT * FROM users WHERE username = $1";
    const res = await pg_pool.query(query, [username]);
    if (res.rows.length === 0)
      return { errorMessage: "No users found with that username" };
    const user: UserCredentials = {
      username: res.rows[0].username,
      password: res.rows[0].password,
    };
    return user;
  } 
  catch (err) 
  {
    console.log(err);
    return { errorMessage: "Internal server error" };
  }
};

export const userExists = async (username: string): Promise<boolean> => {
  const query = "SELECT * FROM users WHERE username = $1";
  const res = await pg_pool.query(query, [username]);
  return res.rows.length !== 0;
};

export const createUser = async (user: UserCredentials): Promise<[success: boolean, userId: number | null]> => {
  const passhash = await hash(user.password)
  try {
    const result = await pg_pool.query<DB_USERS_ROW>(
      "INSERT INTO users (username, passhash) VALUES ($1, $2) RETURNING id",
      [user.username, passhash]
    );
    
    return [true, result.rows[0].id]
  } catch(err) {
    console.log(`err in createUser: ${err}`);
    return [false, null] 
  }
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

export const validateUser = async (user: UserCredentials): Promise<[success: boolean, id: number | null]> => {
  const users: QueryResult<DB_USERS_ROW> = await pg_pool.query("SELECT passhash, id FROM users where username = $1", [user.username])
  if(users.rows.length === 0) {
    return [false, null]
  }
  const isVerified = await verify(user.password, users.rows[0].passhash)
  return [isVerified, users.rows[0].id]
}

export const clearTable = async () => {
  try {
    await pg_pool.query("DELETE FROM users");
  } catch(err){
    console.log(`err occurred in clearTable: ${err}`);
    
  }
}

export const savePlaylist = async (user_id: number, url: string): Promise<boolean> => {
  try {
    await pg_pool.query("INSERT INTO playlists (user_id, playlist_url) VALUES ($1, $2)", [user_id, url])
    return true
  } catch(err) {
    console.log(`Error saving playlist: ${err}`);
    return false
  }
}

export const getPlaylists = async () => {
  try {
    const result = await pg_pool.query("SELECT * FROM playlists")
    if(result.rows.length === 0) {
      console.log("playlists table is empty");
    }
    
    return result.rows

  } catch(err) {
    console.log(`Error in getPlaylists: ${err}`);
    
  }
}
