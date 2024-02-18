import Image from 'next/image'
import Link from 'next/link'
import LeftBar from "@/components/LeftBar";
import Login from "@/components/LoginPage";
import RightBar from "@/components/RightBar";
import Search from "@/components/Search";
import BlogList from "@/components/show"
import Blog from './blog/[id]/page';



export default async function Home() {

  // console.log(user)
  return (
    <div>
      <RightBar/>
      <BlogList/>
    </div>
  );
}