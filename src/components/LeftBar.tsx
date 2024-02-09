"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import logo from "./../../public/logo.png";
import home from "./../../public/home.svg";
import notificationlogo from "./../../public/notifications.svg";
import searchlogo from "./../../public/search.svg";
import Link from "next/link"
import profilelogo from "./../../public/person.svg";

const  LeftBar=() => {
  const [cookie, setCookie] = React.useState<string|undefined>('');

  /************Cookie Part***********/
  useEffect(() => {
    getCookie();
  }, []); // Optional dependency array
  
  const getCookie = () => {
    const cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith('jwt='))?.split('=')[1];
    
    setCookie(cookieValue);
  };


  const goToProfile = () => {
    // request to the server to get the user profile
    // if the user is logged in, then redirect to the profile page
    // else redirect to the login page

    if(!cookie) {
      window.location.href = '/login'
    }
    else{
      window.location.href = '/profile'
    }
  }

  return (
    <header className="flex flex-row items-center bg-white w-full px-4">
      <Link href="/">
        <Image
          className="mb-4 py-2"
          src={logo}
          alt="Logo"
          width={200}
          height={200}
          priority
        />
      </Link>

      <nav className="flex items-center">
        <Link href="/">
          <button className="flex items-center mr-4 hover:text-gray-700 focus:outline-none">
            <Image src={home} alt="Home" height={40} />
            <span className="pl-2 text-lg font-medium">Home</span>
          </button>
        </Link>

        <button className="flex items-center mr-4 hover:text-gray-700 focus:outline-none">
          <Image src={notificationlogo} alt="Notifications" height={40} />
          <span className="pl-2 text-lg font-medium">Notifications</span>
        </button>

        <button className="flex items-center mr-4 hover:text-gray-700 focus:outline-none">
          <Image src={searchlogo} alt="Search" height={40} />
          <span className="pl-2 text-lg font-medium">Explore</span>
        </button>

        <button className="flex items-center hover:text-gray-700 focus:outline-none">
          <Image src={profilelogo} alt="Profile" height={40} />
          <span className="pl-2 text-lg font-medium" onClick={goToProfile}>
            Profile
          </span>
        </button>
      </nav>

      <div className="flex-grow"></div> <Link href="/login">
        <button className="mt-4 text-sm w-20 h-10 text-center bg-[#1d9bf0] text-white rounded-full hover:bg-[#1a89d6] focus:outline-none mr-4">
          Login
        </button>
      </Link>
    </header>
  );
}
export default LeftBar;
