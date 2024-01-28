import Image from "next/image";
import searchlogo from "./../../public/search.svg";

const RightBar = () => {
  return (
    <div className="flex flex-col items-center mt-8">
      <div className="flex w-10/12 bg-[#eff3f4] rounded-full p-[10px] focus:bg-white">
        <Image src={searchlogo} alt="search" />
        <input
          type="text"
          placeholder="Search"
          className="border-0 w-full ml-2 focus:outline-none outline-0 text-1xl bg-inherit"
        />
      </div>
      <div className="mt-8 bg-[#eff3f4] w-10/12 flex flex-col h-3/6">
        <p className="p-[20px] text-xl block font-bold">Trending For You</p>
      </div>
    </div>
  );
};

export default RightBar;
