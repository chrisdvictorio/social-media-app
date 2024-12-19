const WelcomeWindow = () => {
  return (
    <div className="hidden w-full border rounded-lg shadow-lg sm:flex flex-col items-center justify-center gap-4">
      <img alt="logo" src="logo.png" className="w-52" />
      <h1 className="text-4xl text-center font-semibold">
        Welcome to Messages
      </h1>
      <p className="text-center">
        Start a conversation with other users!
        <br></br> Start chatting, share moments, and connect with those who
        matter most.
      </p>
    </div>
  );
};

export default WelcomeWindow;
