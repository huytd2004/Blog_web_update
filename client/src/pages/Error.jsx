import { Link } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

const Error = () => {
  return (
    <div className="flex flex-col h-[100vh] items-center justify-center gap-4 bg-black text-white">
      <h1 className="text-3xl text-center font-bold">
        404 | This page could not be found.
      </h1>
      <Link 
        to="/" 
        className="flex gap-2 items-center text-gray-400 hover:text-white transition-colors"
      >
        <IoArrowBack /> 
        Back to home page.
      </Link>
    </div>
  );
};

export default Error;