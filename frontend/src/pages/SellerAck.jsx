import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SellerAck() {
  const [formData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    idNumber: "",
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Navigate to /shop-info after form submission
    navigate("/shop-info");
  };

  return (
    <div className="flex flex-col w-screen h-screen font-[Poppins][#F6B24D]">

      {/* Main content */}
      <div className="flex flex-col items-center pt-8">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="/src/assets/logo.png"
            alt="USTP Logo"
            className="w-32 h-32"
          />
        </div>

        {/* Title */}
        <h1 className="text-center text-[#2b428f] font-bold text-2xl mb-6">
          USTP MARKET PLACE FOR STUDENTS
        </h1>

        {/* Welcome Text */}
        <h2 className="text-center text-[#183B4E] font-bold text-4xl text-shadow-lg mb-2">
          Welcome User!
        </h2>

        {/* Subtitle */}
        <p className="text-center text-[#183B4E] text-shadow-lg mb-8">
          Registration successful!<br/>
          Start selling now!
        </p>

        {/* Button */}
        <button
          onClick={handleSubmit}
          className="py-3 px-8 text-white font-bold bg-[#2b428f] rounded-md hover:bg-[#244258]"
        >
          Home
        </button>
      </div>
    </div>
  );
}

export default SellerAck;
