import { Link, useSearchParams } from "react-router-dom";
import BlogsCard from "../../components/ui/BlogsCard";
import { categories, capitalizeFirstLetter } from "../../utils/categories";
import useFetch from "../../hooks/useFetch";
import useSend from "../../hooks/useSend";
import { BiSearchAlt } from "react-icons/bi";
import Footer from "../../components/Footer";
import { useRef, useState } from "react";
import { motion } from "framer-motion";

const Home = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "all";
  const search = useRef("");
  const [searchRes, setSearchRes] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const { data, loading } = useFetch(
    `get-blogs/?category=${category}`,
    `home/${category}`
  );
  const { fetchData } = useSend();

  const searchHandler = async () => {
    const res = await fetchData(`search/${search.current.value}`);
    setSearchRes(res);
    res && res.length > 0 && setIsFocused(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-black text-white" id="home">
      {/* Hero Section */}
      <div className="ml-4 md:ml-0 w-[90%] md:w-[80%] xl:w-[65%] md:text-center flex flex-col gap-5 md:gap-8 md:items-center z-10 my-20 sm:my-[15vh]">
        <h1 className="text-5xl leading-tight md:text-6xl md:leading-tight xl:text-7xl xl:leading-tight font-bold mt-5">
        A blogging platform{" "}
          <span className="text-white">
          for IT students, where they share knowledge, experiences and learning materials about technology          </span>
        </h1>
        
        {/* Search Input */}
        <div className="md:w-96 xl:w-[30rem] relative">
          <input
            type="text"
            className="h-12 w-full rounded-xl bg-transparent border-2 border-white outline-none px-5 text-white placeholder:text-gray-400"
            placeholder="Search Blogs"
            ref={search}
            onChange={searchHandler}
            onFocus={() => setIsFocused(true)}
            onBlur={handleInputBlur}
          />
          <BiSearchAlt className="absolute h-11 top-1 right-5 text-xl text-white" />
          
          {/* Search Results Dropdown */}
          {searchRes && searchRes.length > 0 && isFocused && (
            <motion.div
              className="absolute backdrop-blur-xl bg-black/90 mt-5 p-5 rounded-xl max-h-80 overflow-y-scroll border border-gray-800"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              <ul className="w-96 flex flex-col gap-2 items-start">
                {searchRes.map((blogs) => (
                  <li
                    key={blogs._id}
                    className="p-2 rounded-xl hover:bg-white hover:text-black w-full transition-colors"
                  >
                    <Link
                      to={`/blogs/${blogs._id}`}
                      className="cursor-pointer flex gap-2 items-center"
                    >
                      <BiSearchAlt />
                      <p className="line-clamp-1">{blogs.title}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>

        <p className="md:w-[70%] text-xl text-gray-300">
        </p>
      </div>

      {/* Categories Section */}
      <div className="space-y-10 w-[80%] md:w-[52rem] xl:w-[80rem]" id="blogs">
        <h1 className="mt-40 text-4xl text-white">Categories</h1>
        <ul className="flex gap-4 flex-wrap">
          {categories.map((items, index) => (
            <li
              key={index}
              className={`p-4 py-1 shadow-md rounded-full cursor-pointer ${
                category === items 
                ? "bg-white text-black" 
                : "text-white bg-gray-800 hover:bg-gray-700"
              }`}
            >
              <Link to={`/?category=${items}`}>
                {capitalizeFirstLetter(items)}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Blogs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 justify-items-center mt-20">
        {loading ? (
          <div className="col-span-3 animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white" />
        ) : data && data.length > 0 ? (
          data.map((items) => <BlogsCard key={items._id} data={items} />)
        ) : (
          <div className="xl:col-span-3 flex justify-center items-center text-gray-400">
            <h1>Cannot find any blog.</h1>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
