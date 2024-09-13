import { useState } from "react";
import { UserCredentials } from "../types";
import { RegisterUser } from "../api/auth";
export default function RegisterPage() {
  const emptyUser: UserCredentials = { username: "", password: "" };
  const [user, setUser] = useState<UserCredentials>(emptyUser);

  const handleChange =
    (name: keyof UserCredentials) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setUser({ ...user, [name]: e.target.value });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(user);
    RegisterUser(user)
      .then(token => {
        console.log(`token in RegisterPage: ${token}`);
      })
      .catch((err) => {
        console.log(`error in registerUser: ${err}`);
    })
  };

  return (
    <>
      <div className="border-black border-[1px] rounded-sm m-4 p-4 w-full justify-center items-center">
        <form
          action=""
          className="flex flex-col justify-center items-center"
          onSubmit={handleSubmit}
        >
          <input
            className="border-black border-[1px] px-3 py-1"
            type="text"
            name="username"
            id="username"
            placeholder="Enter Username"
            onChange={handleChange("username")}
          />
          <input
            className="border-black border-[1px] px-3 py-1"
            type="password"
            name="password"
            id="password"
            placeholder="Enter Password"
            onChange={handleChange("password")}
          />
          <button
            type="submit"
            className="border-black border-[1px] px-4 py-2 bg-slate-400"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
