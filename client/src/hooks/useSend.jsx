import { useEffect, useState } from "react";

//Dùng để GỬI dữ liệu lên server (POST, PUT, DELETE)
const useSend = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  // Lấy token từ localStorage khi load trang lần đầu tiên
  useEffect(() => {
    const isToken = localStorage.getItem("authToken");
    if (isToken) {
      setToken(isToken);
    }
  }, []);

  // Hàm gửi dữ liệu lên server
  const fetchData = async (url, method, body) => {
    setLoading(true);
    try {
      // Tạo cấu hình cho request
      const options = {
        method: method,
        headers: {},
      };
      // Nếu có token thì thêm vào header
      if (token) {
        options.headers.Authorization = token;
      }
      // Nếu là POST hoặc PUT thì thêm body vào request
      if (method === "POST" || method === "PUT") {
        if (body instanceof FormData) { // FormData là dữ liệu gửi lên dưới dạng form
          options.body = body;
        } else {
          options.headers["Content-Type"] = "application/json";
          options.body = JSON.stringify(body);
        }
      }
      // Gửi request lên server
      const res = await fetch(import.meta.env.VITE_BASE_URL + url, options);
      // Nếu có lỗi thì throw error
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error while fetching data.");
      }
      // Nếu không có lỗi thì trả về dữ liệu
      const resData = await res.json();
      setLoading(false);
      return resData;
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  return { fetchData, error, loading };
};

export default useSend;
