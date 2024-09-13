import { UserCredentials } from "../types";
import { tokenResponseSchema } from "../schemas";

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

  if(!parsedToken.success) {
    throw new Error("Failed to parse JSON")
  }

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
    console.log("error occured in login response");
  }
  if(response.status === 307) {
    window.location.href = "/"
  }
  console.log("Login function probably succeeded");
  
}
