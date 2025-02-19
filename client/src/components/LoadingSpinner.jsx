const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white" />
    </div>
  );
};

export default LoadingSpinner;