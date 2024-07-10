import React, { useEffect } from "react";
import axios from "axios";

const HomePage = () => {
  const chatList = async () => {
    const response = await axios.get("http://localhost:5000/api/chats");
    console.log(response);
  };
  useEffect(() => {
    chatList();
  }, []);

  return (
    <div className="text-center">
      <h1>Home Page</h1>
    </div>
  );
};

export default HomePage;
