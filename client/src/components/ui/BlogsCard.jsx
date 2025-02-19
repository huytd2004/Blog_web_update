/* eslint-disable react/prop-types */
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const BlogsCard = ({ data }) => {
  const date = data.createdAt;
  const redirect = useNavigate();

  return (
    <motion.div
      className="w-4/5 md:w-[25rem] flex flex-col rounded-xl bg-black border border-gray-800"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <img
        src={data.img.url}
        alt="thumbnail"
        className="aspect-video rounded-t-xl cursor-pointer object-cover"
        onClick={() => redirect(`/blogs/${data._id}`)}
      />
      <div className="flex flex-col gap-3 py-6 px-5">
        <span className="py-1 px-4 bg-white text-black w-[fit-content] rounded-full text-sm font-medium">
          {data.category.toUpperCase()}
        </span>
        <h1
          className="text-2xl text-white hover:underline cursor-pointer line-clamp-2 font-semibold"
          onClick={() => redirect(`/blogs/${data._id}`)}
        >
          {data.title}
        </h1>
        <Link
          className="text-gray-400 hover:text-white hover:underline transition-colors"
          to={`/users/${data.author}`}
        >
          @{data.author}
        </Link>
        <span className="text-gray-500 text-sm">{date && date.substring(0, 10)}</span>
      </div>
    </motion.div>
  );
};

export default BlogsCard;