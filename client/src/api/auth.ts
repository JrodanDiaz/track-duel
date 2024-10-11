import { User, UserCredentials } from "../types";
import { implicitLoginSchema, tokenResponseSchema } from "../schemas";

export async function RegisterUser(user: UserCredentials) {
  
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
    credentials: "include"
  });

  if (response.status === 409) throw new Error("User already exists")
  if (!response.ok) throw new Error("Internal Server Error")

  const tokenData = await response.json()
  const parsedToken = tokenResponseSchema.safeParse(tokenData)

  if(!parsedToken.success) throw new Error("Failed to parse JSON")
  if("errorMessage" in parsedToken.data) throw new Error(parsedToken.data.errorMessage)

  return parsedToken.data.auth_token
}

export async function LoginUser(user: UserCredentials) {
  
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
    credentials: "include"
  });
  if (!response.ok) {
    console.log("error occured while logging in");
  }
  if(response.status === 307) {
    window.location.href = "/"
  }

  const userData = implicitLoginSchema.safeParse(await response.json())
  if(!userData.success) throw new Error("Internal Server Error")
  if("errorMessage" in userData.data) throw new Error(userData.data.errorMessage)
  return userData.data.auth_token
}

export const getToken = async (): Promise<string> => {
    const tokenRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/getToken`, {
      credentials: "include"
    })

    const tokenJson = await tokenRes.json()
    const parsedToken = tokenResponseSchema.safeParse(tokenJson)

    if(!parsedToken.success) throw new Error("Auth token not set")
    if("errorMessage" in parsedToken.data) throw new Error(parsedToken.data.errorMessage)

    return parsedToken.data.auth_token
  }

  export const getUserFromToken = async (): Promise<User> => {
    const implicitLoginResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/implicit_login`, {
      credentials: "include"
    })
    const user = implicitLoginSchema.safeParse(await implicitLoginResponse.json())

    if(!user.success) throw new Error("Internal Server Error")
    if("errorMessage" in user.data) throw new Error(user.data.errorMessage)
    
    console.log(`getUserFromToken: username = ${user.data.username} token = ${user.data.auth_token}`);

    return {...user.data, spotify_token: ""}
    
  }

  export const isLoggedIn = (user: User) => {
    return user.username && user.spotify_token && user.auth_token
  }
