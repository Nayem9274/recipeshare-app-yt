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
    <div className="ml-[50px] flex flex-row items-center">
      <Image className="mb-4" src={logo} alt="Logo" width={160} height={160} />
      <div className="flex items-center ml-4">
        <Image height={40} src={home} alt="Home" />
        <Link href="/">
          <span className="text-3xl pl-[15px]">Home</span>
        </Link>
      </div>
      <div className="flex items-center ml-4">
        <Image height={40} src={notificationlogo} alt="Notifications" />
        <button className="text-3xl pl-[15px]">Notifications</button>
      </div>
      <div className="flex items-center ml-4">
        <Image height={40} src={searchlogo} alt="Search" />
        <button className="text-3xl pl-[15px]">Explore</button>
      </div>
      <div className="flex items-center ml-4">
        <Image height={40} src={profilelogo} alt="Profile" />
        <button className="text-3xl pl-[15px]" onClick={goToProfile}>Profile</button>
      </div>
      <Link href="/login">
        <span className="mt-4 text-sm w-20 p-1 rounded-full text-white text-center bg-[#1d9bf0]">
          Login
        </span>
      </Link>
    </div>
  );
}
export default LeftBar;
