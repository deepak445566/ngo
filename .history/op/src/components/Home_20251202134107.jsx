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

   
      <section className="py-16 px-8 lg:px-20 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 exo">
              Our Focus Areas
            </h2>
            <p className="text-xl text-gray-600 new max-w-3xl mx-auto">
              We are dedicated to providing comprehensive support for children and youth in need
            </p>
          </div>

         

         {/* Services Grid - Circle Design */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-20 px-4">
  {/* Education */}
  <div className="flex flex-col items-center text-center group">
    <div className="relative mb-6">
      {/* Outer circle with hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#50C779] to-[#3EAE66] rounded-full blur-lg opacity-0 group-hover:opacity-70 transition-all duration-500 scale-0 group-hover:scale-110"></div>
      
      {/* Main circle with image */}
      <div className="relative h-48 w-48 rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:border-[#50C779] transition-all duration-300">
        <img 
          src="/images/mc1.avif" 
          alt="Education" 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Overlay icon */}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Book className="h-12 w-12 text-white" />
        </div>
      </div>
      
      {/* Number badge */}
      <div className="absolute -top-2 -right-2 h-10 w-10 bg-[#50C779] rounded-full flex items-center justify-center text-white font-bold shadow-lg">
        1
      </div>
    </div>
    
    {/* Content below circle */}
    <h3 className="text-2xl font-bold mb-3 exo text-gray-800 group-hover:text-[#50C779] transition-colors duration-300">
      Education
    </h3>
   

    
    {/* Learn More Button */}
   
  </div>

  {/* Clothes */}
  <div className="flex flex-col items-center text-center group">
    <div className="relative mb-6">
      <div className="absolute inset-0 bg-gradient-to-r from-[#50C779] to-[#3EAE66] rounded-full blur-lg opacity-0 group-hover:opacity-70 transition-all duration-500 scale-0 group-hover:scale-110"></div>
      
      <div className="relative h-48 w-48 rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:border-[#50C779] transition-all duration-300">
        <img 
          src="/images/clothes-circle.jpg" 
          alt="Clothes" 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Shirt className="h-12 w-12 text-white" />
        </div>
      </div>
      
      <div className="absolute -top-2 -right-2 h-10 w-10 bg-[#50C779] rounded-full flex items-center justify-center text-white font-bold shadow-lg">
        2
      </div>
    </div>
    
    <h3 className="text-2xl font-bold mb-3 exo text-gray-800 group-hover:text-[#50C779] transition-colors duration-300">
      Clothes
    </h3>
   
  </div>

  {/* Food */}
  <div className="flex flex-col items-center text-center group">
    <div className="relative mb-6">
      <div className="absolute inset-0 bg-gradient-to-r from-[#50C779] to-[#3EAE66] rounded-full blur-lg opacity-0 group-hover:opacity-70 transition-all duration-500 scale-0 group-hover:scale-110"></div>
      
      <div className="relative h-48 w-48 rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:border-[#50C779] transition-all duration-300">
        <img 
          src="/images/food-circle.jpg" 
          alt="Food" 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Utensils className="h-12 w-12 text-white" />
        </div>
      </div>
      
      <div className="absolute -top-2 -right-2 h-10 w-10 bg-[#50C779] rounded-full flex items-center justify-center text-white font-bold shadow-lg">
        3
      </div>
    </div>
    
    <h3 className="text-2xl font-bold mb-3 exo text-gray-800 group-hover:text-[#50C779] transition-colors duration-300">
      Food
    </h3>
   
  </div>

  {/* Home & Shelter */}
  <div className="flex flex-col items-center text-center group">
    <div className="relative mb-6">
      <div className="absolute inset-0 bg-gradient-to-r from-[#50C779] to-[#3EAE66] rounded-full blur-lg opacity-0 group-hover:opacity-70 transition-all duration-500 scale-0 group-hover:scale-110"></div>
      
      <div className="relative h-48 w-48 rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:border-[#50C779] transition-all duration-300">
        <img 
          src="/images/shelter-circle.jpg" 
          alt="Home & Shelter" 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <HomeIcon className="h-12 w-12 text-white" />
        </div>
      </div>
      
      <div className="absolute -top-2 -right-2 h-10 w-10 bg-[#50C779] rounded-full flex items-center justify-center text-white font-bold shadow-lg">
        4
      </div>
    </div>
    
    <h3 className="text-2xl font-bold mb-3 exo text-gray-800 group-hover:text-[#50C779] transition-colors duration-300">
      Home & Shelter
    </h3>
   
  </div>
</div>

          {/* How You Can Help */}
          <div className="mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4 exo">
              How You Can Help
            </h2>
            <p className="text-xl text-gray-600 text-center mb-12 new max-w-3xl mx-auto">
              Your support can transform a child's life. Choose how you want to contribute.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  title: "Sponsor a Child", 
                  amount: "₹1000/month", 
                  desc: "Provide education, food, and clothing for one child",
                  icon: <Users className="h-10 w-10 text-[#50C779]" />
                },
                { 
                  title: "Donate Supplies", 
                  amount: "Any Amount", 
                  desc: "Contribute clothes, books, or school supplies",
                  icon: <Shirt className="h-10 w-10 text-[#50C779]" />
                },
                { 
                  title: "Volunteer", 
                  amount: "Your Time", 
                  desc: "Teach, mentor, or help with distribution",
                  icon: <Heart className="h-10 w-10 text-[#50C779]" />
                }
              ].map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl p-8 border border-gray-200 hover:border-[#50C779] hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center mb-6">
                    {item.icon}
                    <div className="ml-4">
                      <h4 className="text-2xl font-bold exo">{item.title}</h4>
                      <div className="text-[#50C779] font-semibold">{item.amount}</div>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6">{item.desc}</p>
                  <button className="w-full bg-[#50C779] hover:bg-[#3EAE66] text-white py-3 rounded-xl font-semibold transition duration-300">
                    Get Involved
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 exo">
              Together We Can Change Lives
            </h2>
            <p className="text-xl text-gray-600 mb-10 new max-w-3xl mx-auto">
              Every child deserves education, clothing, food, and a safe home. Join us in making this a reality.
            </p>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <button className="bg-[#50C779] hover:bg-[#3EAE66] text-white px-10 py-4 rounded-2xl font-semibold text-xl transition duration-300 shadow-lg hover:scale-105">
                Donate Now
              </button>
              <button className="bg-transparent border-2 border-[#50C779] text-[#50C779] hover:bg-[#50C779] hover:text-white px-10 py-4 rounded-2xl font-semibold text-xl transition duration-300">
                Volunteer Today
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;