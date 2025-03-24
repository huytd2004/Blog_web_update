import { useQuery } from "@tanstack/react-query";

// Dùng để lấy dữ liệu từ server (Get)
const useFetch = (url, queryKey) => {
  const token = localStorage.getItem("authToken");
  
  // useQuery hook giúp gửi request lên server và lấy dữ liệu về
  const { isPending, error, isError, data, refetch } = useQuery({
    queryKey: [queryKey], // queryKey là mảng chứa các giá trị để xác định cache
    queryFn: async ({ signal }) => { // queryFn là hàm gửi request lên server
      try {
        const response = await fetch(import.meta.env.VITE_BASE_URL + url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          signal,
        });

        if (!response.ok) {
          const errorMessage = await response.json();
          throw new Error(errorMessage.message);
        }

        const responseData = await response.json();
        return responseData;
      } catch (error) {
        console.error("Fetch Error:", error.message);
        throw error;
      }
    },
  });

  return { data, isError, error, loading: isPending, refetch };
};

export default useFetch;
