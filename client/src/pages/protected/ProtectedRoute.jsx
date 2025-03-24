import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/Authentication";
import { useNavigate } from "react-router-dom";
//chỉ cho phép người dùng đã đăng nhập mới có thể truy cập vào các trang cần bảo vệ
const ProtectedRoute = ({ children }) => {
  const { isAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    !isAuth && navigate("/auth?mode=login", { replace: true });
  }, [isAuth, navigate]);

  return isAuth && children;
};

export default ProtectedRoute;
