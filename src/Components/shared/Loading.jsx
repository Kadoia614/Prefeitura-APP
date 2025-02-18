const Loading = () => {
  return (
    <>
      <div className="absolute flex justify-center items-center h-full w-full left-0 top-0">
        <div className="border-l-2 border-t-3 border-primary w-10 h-10 rounded-full animate-spin"></div>
      </div>
    </>
  );
};

export default Loading;
