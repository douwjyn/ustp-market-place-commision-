import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SellerReg() {
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
    navigate("/app/shop/info");
  };

  return (
    <div className="flex flex-col w-screen h-screen font-[Poppins][#F6B24D]">
      {/* Header with Home button */}
      <div className="p-4 absolute top-0 left-0">
        <Link
          to="/app/dashboard"
          className="bg-[#183B4E] text-white px-3 py-1 rounded-md text-sm inline-block"
        >
          Home
        </Link>
      </div>

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
          Provide your necessary information and<br />
          register as a seller.
        </p>

        {/* Button */}
        <button
          onClick={handleSubmit}
          className="py-3 px-8 text-white font-bold bg-[#2b428f] rounded-md hover:bg-[#244258]"
        >
          Start Selling Now!
        </button>
      </div>
    </div>
  );
}

export default SellerReg;
