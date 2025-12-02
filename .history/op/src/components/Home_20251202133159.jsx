// src/components/Home.jsx
import React from "react";

import ImageSlider from "./ImageSlider";
import { Book, Shirt, Home as HomeIcon, Utensils, Heart, Users } from "lucide-react";

const Home = () => {
  return (
    <div className="bg-white text-gray-800 ">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
      
    
      
      {/* Slider Section */}
      <section className="h-[100vh]">
        <ImageSlider />
      </section>

   
     
    </div>
  );
};

export default Home;