import { useContext, useEffect } from "react";
import { redirect, useNavigate, useSearchParams } from "react-router-dom";
import AuthForm from "../../components/authForm/authForm";
import { AuthContext } from "../../context/Authentication";

//Auth -> gọi đến AuthForm -> action -> gửi request đến server -> nhận token -> lưu token vào localStorage -> lưu trạng thái isAuth vào context -> chuyển hướng về trang chủ
const Auth = () => {
  const [searchParams] = useSearchParams();
  const redirect = useNavigate();
  const { isAuth } = useContext(AuthContext);
  useEffect(() => {
    if (searchParams.get("mode") !== ("login" || "signup")) {
      redirect("/auth?mode=signup");
    }
    if (isAuth) {
      redirect("/");
    }
  }, [searchParams, redirect, isAuth]);

  return (
    <div className="flex items-center justify-center h-lvh">
      <AuthForm />
    </div>
  );
};
export default Auth;


//function xảy ra khi submit form
export async function action({ request }) {
  const params = new URL(request.url).searchParams;
  const mode = params.get("mode") || "login";

  try {
    const data = await request.formData();
    const authData = {
      firstname: data.get("firstname"),
      lastname: data.get("lastname"),
      email: data.get("email"),
      password: data.get("password"),
    };
    
    const response = await fetch(import.meta.env.VITE_BASE_URL + mode, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(authData),
    });

    // Kiểm tra xem response có empty không
    const responseText = await response.text();
    if (!responseText) {
      return { message: "Server returned empty response" };
    }

    // Parse JSON sau khi đã kiểm tra
    const resData = JSON.parse(responseText);

    if (
      response.status === 400 ||
      response.status === 401 ||
      response.status === 404
    ) {
      return resData;
    }

    if (!response.ok) {
      return { message: "Could not authenticate user." };
    }

    if ("authToken" in resData) {
      localStorage.setItem("authToken", "Bearer " + resData.authToken);
    } else {
      return redirect("/auth?mode=login");
    }
    
    return resData;
  } catch (error) {
    console.error('Auth error:', error);
    return { 
      message: "Authentication failed. Please try again later.",
      error: error.message 
    };
  }
}
