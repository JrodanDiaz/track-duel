import { redirect } from "react-router-dom";
import { UserCredentials } from "../types";

export async function RegisterUser(user: UserCredentials) {
  
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
    credentials: "include"
  });
  if (!response.ok) {
    console.log("error occured in response");
  }
  console.log("Register function probably succeeded");
  
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
