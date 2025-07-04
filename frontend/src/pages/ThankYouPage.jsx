import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";  
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

export default function ThankYouPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    
    axios.get("http://localhost:8000/api/user", {
      withCredentials: true 
    })
    .then((response) => {
      setUser(response.data); 
    })
    .catch((error) => {
      console.error("Failed to fetch user data:", error);
    })
    .finally(() => {
      setTimeout(() => setLoading(false), 1000); 
    });
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col h-screen w-screen items-center justify-center">
      <div className="flex flex-col h-[700px] w-[700px] bg-[#F5F5F5] rounded-full shadow-[0_4px_30px_#183B4E] animate-fade-in items-center justify-center">
        <img src={logo} alt="USTP Logo" className="w-[170px] mb-3" />
        <h1 className="mb-8 text-[#2a3d8f] text-[28px] font-bold text-center">
          USTP MARKET PLACE FOR STUDENTS
        </h1>
        <div className="mb-8 text-center text-[#073b4c] font-bold text-[48px] leading-tight">
          <p className="m-0">
            Thank you for your registry{user ? `, ${user.name}` : ""}!
          </p>
          <p className="m-0">You can now start exploring</p>
          <p className="m-0">our platform!</p>
        </div>
        <Link to="/login">
          <button className="mt-5 py-4 px-8 text-[18px] text-white font-bold bg-[#2a3d8f] border-none rounded-xl cursor-pointer">
            Login
          </button>
        </Link>
      </div>
    </div>
  );
}
