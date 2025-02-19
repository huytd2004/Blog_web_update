import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import parse from "html-react-parser";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import useFetch from "../../hooks/useFetch";
import useSend from "../../hooks/useSend";
import Footer from "../../components/Footer";
import { motion, useScroll } from "framer-motion";

const Blogs = () => {
  const params = useParams();
  const {
    data,
    loading: loadingBlog,
    isError,
  } = useFetch(`get-blog/${params.blogId}`, params.blogId);
  const [comment, setComment] = useState("");
  const { data: commentData, refetch } = useFetch(
    `get-comments/${params.blogId}`,
    `comments-${params.blogId}`
  );
  const { fetchData, loading } = useSend();
  const history = useNavigate();

  const deleteBlogHandler = async () => {
    const isSure = window.confirm("Are you sure to delete?");
    if (isSure) {
      const response = await fetchData(
        `delete-blog/${params.blogId}`,
        "DELETE"
      );
      console.log(response);
      history(-1);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    const response = await fetchData(
      `create-comment/${params.blogId}`,
      "POST",
      {
        description: comment,
      }
    );
    !response && alert("Login to add a comment.");
    setComment("");
    return refetch();
  };

  const deleteComment = async (id) => {
    await fetchData(`delete-comment/${id}`, "DELETE");
    return refetch();
  };

  const { scrollYProgress } = useScroll();

  return (
    <div className="flex flex-col items-center mt-28 bg-black text-white">
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="h-1 w-full fixed left-0 right-0 top-0 bg-white transform origin-left"
      />
      {loadingBlog ? (
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white" />
      ) : data && !isError ? (
        <div className="w-[85%] md:w-[70%] xl:w-[55%]">
          <div className="flex justify-between">
            <span
              className="flex gap-2 items-center underline cursor-pointer w-[fit-content] text-gray-300 hover:text-white"
              onClick={() => history(-1)}
            >
              <IoArrowBack />
              Go back
            </span>
            {data.auth && (
              <div className="flex gap-2 text-xl cursor-pointer">
                <MdDelete
                  className="text-red-500 hover:text-red-400"
                  onClick={deleteBlogHandler}
                />
                <FaEdit
                  className="text-green-500 hover:text-green-400"
                  onClick={() => history(`/blogs/${params.blogId}/edit`)}
                />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-10 my-10">
            <h1 className="text-4xl md:text-6xl font-arapey text-white">{data.title}</h1>
            <img src={data.img.url} alt="blog image" className="w-full object-cover rounded-lg" />
            <div className="flex justify-between w-full text-gray-300">
              <Link
                to={`/users/${data.author}`}
                className="cursor-pointer hover:text-white hover:underline transition-colors"
              >
                By {data.author}
              </Link>
              <span>Created on: {data.createdAt.substring(0, 10)}</span>
            </div>
            <article className="prose-invert prose-lg lg:prose-xl text-gray-200">
              {parse(data.description)}
            </article>
            <div className="space-y-4">
              <form
                action="POST"
                onSubmit={handleComment}
                className="flex relative"
              >
                <input
                  type="text"
                  required
                  className="w-full bg-transparent border-b border-gray-700 h-10 px-2 focus:outline-none focus:border-white text-white placeholder-gray-500"
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-0 px-4 py-1 rounded-md text-white hover:text-gray-300 disabled:opacity-50 transition-colors"
                  disabled={loading}
                >
                  Add
                </button>
              </form>
              {commentData && commentData.length > 0 ? (
                commentData.map((item) => (
                  <div key={item._id} className="text-lg border-b border-gray-800 pb-4">
                    <div className="flex justify-between">
                      <Link
                        to={`/users/${item.username}`}
                        className="text-gray-300 hover:text-white hover:underline transition-colors"
                      >
                        @{item.username}
                      </Link>
                      <div className="flex items-center gap-1 text-gray-400">
                        <span>{item.createdAt.substring(0, 10)}</span>
                        {item.isUser && (
                          <button
                            disabled={loading}
                            className="disabled:opacity-50"
                          >
                            <MdDelete
                              onClick={() => deleteComment(item._id)}
                              className="cursor-pointer text-red-500 hover:text-red-400"
                            />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-200 mt-2">{item.description}</p>
                  </div>
                ))
              ) : (
                <h1 className="text-gray-400 text-xl">There are currently no comments on this blog post.</h1>
              )}
            </div>
          </div>
        </div>
      ) : (
        <h1 className="text-xl text-gray-300">Blog not found.</h1>
      )}
      <Footer />
    </div>
  );
};

export default Blogs;
