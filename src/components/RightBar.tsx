import Image from "next/image";
import searchlogo from "./../../public/search.svg";
import Search from "./Search";

const RightBar = () => {
  return (
    <div className="flex flex-col items-center mt-8">
        <Search/>
      {/* <div className="mt-8 bg-[#eff3f4] w-10/12 flex flex-col h-3/6">
        <p className="p-[20px] text-xl block font-bold">Trending For You</p>
      </div> */}
    </div>
  );
};

export default RightBar;
