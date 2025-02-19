import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <hr className="mt-20 border border-gray-700 bg-gray-700 w-[85%] md:w-[75%] mx-auto rounded-[100%] h-[2px]" />
      <div className="py-10 px-10 sm:px-0 flex flex-col sm:flex-row gap-4 sm:gap-0 justify-evenly w-full sm:items-center bg-black text-white">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-white">
            Blog-Web
          </h1>
        </div>
        <hr className="border-gray-800 sm:hidden" />
        <p className="text-gray-400 text-sm">
          © 2024 by Blog-Web. &nbsp;All rights reserved.
        </p>
      </div>
    </>
  );
};

export default Footer;