"use client";

import Image from "next/image";
import logo from "../../../public/logo.png";
import { FormEvent, useState } from "react";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(username);
    console.log(password);

    try {
      const response = await fetch(
        "https://recipeshare-tjm7.onrender.com/api/user/signup/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password, email }),
        }
      );

      console.log(response);

      if (response.ok) {
        const data = await response.json();
        if (data.jwt) {
          console.log("User signed up!");
          setUsername("");
          setPassword("");
          setEmail("");
          setError("");
        } else {
          setError("Invalid response from server");
        }
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error signing up");
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 min-h-screen">
      <div className="bg-white shadow rounded-lg px-8 pt-6 pb-8 mb-4 flex flex-col w-full max-w-md">
        <Image
          src={logo}
          alt="Recipe Share Logo"
          width={80}
          height={80}
          className="mx-auto mb-6"
        />
        <h2 className="text-center text-2xl font-semibold mb-4">
          Sign up for RecipeShare
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-md px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-md px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 w-full"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-md px-4 py-2 font-semibold tracking-wider hover:bg-blue-700 transition-colors duration-200 ease-in"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
