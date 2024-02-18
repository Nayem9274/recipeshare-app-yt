"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import logo from "./../../public/logo.png";
import home from "./../../public/home.svg";
import notificationlogo from "./../../public/notifications.svg";
import searchlogo from "./../../public/search.svg";
import Link from "next/link";
import profilelogo from "./../../public/person.svg";
import accountlogo from "./../../public/account.svg";

import { useState } from "react";

interface UserDetailsProps {
  username: string;
  email: string;
  image: string;
  jwt: string;
}

const LeftBar = () => {
  const [cookie, setCookie] = React.useState<string | undefined>("");
  const [userDetails, setUserDetails] = useState<UserDetailsProps>({
    username: "",
    email: "",
    image: "",
    jwt: "",
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /************Cookie Part***********/
  useEffect(() => {
    (async () => {
      const cookie = document.cookie
        .split(";")
        .find((c) => c.trim().startsWith("jwt="));
      if (cookie) {
        const jwt = cookie.split("=")[1];
        const jwtData = {
          jwt: jwt,
        };
        console.log(jwtData);
        const userData = await fetch(
          "https://recipeshare-tjm7.onrender.com/api/user/details/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(jwtData),
          }
        );
        const data = await userData.json();
        if (!data.error) {
          setIsLoggedIn(true);
          const tempData = {
            username: data.user_details.name,
            email: data.user_details.email,
            image: data.user_details.image,
            jwt: jwt,
          };
          setUserDetails(tempData);
        }
      }
    })();
  }, []);

  const getCookie = () => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1];

    setCookie(cookieValue);
  };

  const goToProfile = () => {
    // request to the server to get the user profile
    // if the user is logged in, then redirect to the profile page
    // else redirect to the login page

    if (!isLoggedIn) {
      window.location.href = "/login";
    } else {
      window.location.href = "/profile";
    }
  };

  return (
    <header className="flex flex-row items-center bg-white w-full">
      <Link href="/">
        <Image
          className="mb-4 py-2"
          src={logo}
          alt="Logo"
          width={150}
          height={100}
          priority
        />
      </Link>
      <nav className="flex items-center">
        <Link href="/">
          <button className="rounded-full p-1 w-[150px] hover:bg-[#ece7e7] hover:text-gray-700 flex items-center mr-4  focus:outline-none">
            <Image src={home} alt="Home" height={40} width={40} />
            <span className="pl-2 text-lg font-medium">Home</span>
          </button>
        </Link>

        <button className="rounded-full p-1 w-[150px] hover:bg-[#ece7e7] flex items-center mr-4 hover:text-gray-700 focus:outline-none">
          <Image
            src={notificationlogo}
            alt="Notifications"
            height={40}
            width={40}
          />
          <span className="pl-2 text-lg font-medium">Notifications</span>
        </button>

        <Link href="/explore">
          <button className="rounded-full p-1 w-[150px] hover:bg-[#ece7e7] flex items-center mr-4 hover:text-gray-700 focus:outline-none">
            <Image src={searchlogo} alt="Search" height={40} />
            <span className="pl-2 text-lg font-medium">Explore</span>
          </button>
        </Link>
      </nav>
      <div className="flex-grow"></div>{" "}
      {!isLoggedIn && (
        <Link href="/login">
          <button className="mt-4 text-sm w-20 h-10 text-center bg-[#1d9bf0] text-white rounded-full hover:bg-[#1a89d6] focus:outline-none mr-4">
            Login
          </button>
        </Link>
      )}
      {isLoggedIn && (
        <Link href="/profile">
          <button className="rounded-full p-1 w-[150px] hover:bg-[#ece7e7] flex items-center hover:text-gray-700 focus:outline-none">
            <Image src={accountlogo} alt="Profile" height={40} />
            <span className="pl-2 text-lg font-medium" onClick={goToProfile}>
              Account
            </span>
          </button>
        </Link>
      )}
    </header>
  );
};
export default LeftBar;
