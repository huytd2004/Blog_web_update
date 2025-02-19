/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { FaRegCalendarAlt } from "react-icons/fa";

const UsersCard = ({ data }) => {
  return (
    <div className="flex flex-col gap-10 items-center border border-gray-800 w-[fit-content] rounded-md p-8 bg-black text-white">
      <div className="flex gap-5">
        <img
          src={data.profileImg.url}
          alt="profile pic"
          className="w-24 rounded-full aspect-square object-cover border-2 border-gray-800"
        />
        <div>
          <Link
            className="text-xl text-white hover:text-gray-300 hover:underline transition-colors"
            to={`/users/${data.username}`}
          >
            @{data.username}
          </Link>
          <h1 className="text-gray-300 font-medium mt-1">
            {`${data.firstname} ${data.lastname}`}
          </h1>
          <span className="flex items-center gap-1 text-gray-400 text-sm mt-2">
            <FaRegCalendarAlt className="text-gray-400" /> 
            Date joined: {data.createdAt.substring(0, 10)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UsersCard;