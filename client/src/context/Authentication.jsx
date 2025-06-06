/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
export const AuthContext = createContext({});
import useFetch from "../hooks/useFetch";

//chia sẻ state cho các component con
const Authentication = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const { data } = useFetch("", "auth");
  const [username, setUserName] = useState("");

  // checking if token is recieved and then change the authentication state to true
  useEffect(() => {
    if (data && data.isLogedin) {
      setIsAuth(true);
      setUserName(data.username);
    } else {
      setIsAuth(false);
    }
  }, [data]);

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth, username, setUserName }}>
      {children}
    </AuthContext.Provider>
  );
};

export default Authentication;
