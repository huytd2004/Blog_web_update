import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CiMenuFries } from "react-icons/ci";
import { MdClose } from "react-icons/md";
import { AuthContext } from "../context/Authentication";

const Navbar = () => {
  const { isAuth, setIsAuth, username } = useContext(AuthContext); //gọi đến context Authentication để lấy giá trị isAuth và setIsAuth
  const pre = "top-[-22rem] right-[-5rem]";
  const post = "right-[1.5rem] top-20 shadow-xl bg-black";
  const [active, setActive] = useState(pre);
  const menuHandler = () => {
    active === pre ? setActive(post) : setActive(pre);
  };

  function logoutHandler() {
    setIsAuth(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
  }

  const linkStyle = "text-[1.1rem] p-2 rounded-xl hover:bg-gray-900 transition-all text-white";
  return (
    <div className="fixed top-0 sm:top-5 left-0 w-full h-16 flex justify-center items-center z-50">
      <div className="sm:bg-black gap-4 backdrop-blur-md flex items-center justify-between sm:justify-normal sm:rounded-xl p-4 w-full sm:w-auto h-16">
        <h2 className="text-2xl text-white font-bold">
          Blog Web
        </h2>
        <div
          className={`absolute rounded-2xl sm:relative ${active} sm:top-0 sm:right-0 sm:shadow-none transition-all duration-300 w-44 sm:w-auto bg-black`}
        >
          <ul className="w-36 py-7 pl-5 flex flex-col gap-2 sm:gap-4 sm:flex-row sm:w-[fit-content] sm:p-0">
            <li className={linkStyle}>
              <Link href="/#home">Home</Link>
            </li>
            <li className={linkStyle}>
              <a href="/#blogs">Blogs</a>
            </li>
            <li className={linkStyle}>
              <Link to="/users">Creators</Link>
            </li>
            <li className={linkStyle}>
              <Link to="/blogs/create-blog">Create</Link>
            </li>
            {!isAuth ? (
              <>
                <li className={linkStyle}>
                  <Link to="/auth?mode=login">Login</Link>
                </li>
                <li className="text-[1.1rem] py-2 px-4 rounded-xl bg-white text-black text-center hover:bg-gray-200 transition-all">
                  <Link to="/auth/?mode=signup">Sign Up</Link>
                </li>
              </>
            ) : (
              <>
                <li className={linkStyle}>
                  <Link to={`/users/${username}`}>Profile</Link>
                </li>
                <li className="text-[1.1rem] py-2 px-4 rounded-xl bg-white text-black text-center hover:bg-gray-200 transition-all">
                  <Link to="/auth/?mode=signup" onClick={logoutHandler}>
                    Logout
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
        <button
          className="sm:hidden text-white"
          onClick={menuHandler}
          onBlur={menuHandler}
        >
          {active === pre ? (
            <CiMenuFries className="text-2xl cursor-pointer" />
          ) : (
            <MdClose className="text-2xl cursor-pointer" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Navbar;