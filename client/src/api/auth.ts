import { UserCredentials } from "../types";

export async function RegisterUser(user: UserCredentials) {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    console.log("error occured in response");
  }
}
