import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot";

const App = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Chatbot />
    </>
  );
};

export default App;
