import React from "react";

const AboutSection = () => {
  return (
    <section className="py-16 px-8 lg:px-0 bg-white">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Left - Image Section */}
          <div className="w-full lg:w-1/2">
            <div className="relative">
              {/* Main Image */}
              <img 
                src="/images/main1.png" 
                alt="The Akshaya Patra Foundation" 
                className="rounded-2xl shadow-xl w-full h-[90vh] object-cover"
              />
              
              {/* Overlay Stats */}
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-[#50C779] to-[#3EAE66] text-white p-6 rounded-xl shadow-2xl">
                <div className="text-3xl font-bold">3M+</div>
                <div className="text-sm font-medium">Children Fed Daily</div>
              </div>
              
              {/* Decorative Element */}
              <div className="absolute -top-6 -left-6 h-24 w-24 border-4 border-[#50C779]/30 rounded-full"></div>
            </div>
            
            {/* Small Images Row Below */}
           
          </div>
          
          {/* Right - Content Section */}
          <div className="w-full lg:w-1/2">
            {/* Title and Tag */}
            <div className="mb-8">
              <span className="inline-block bg-[#50C779]/10 text-[#50C779] px-4 py-2 rounded-full text-sm font-semibold mb-4">
                About Our Foundation
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6 exo">
                The Akshaya Patra Foundation
              </h2>
            </div>
            
            {/* Main Description */}
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6 leading-relaxed">
                The Akshaya Patra Foundation is a not-for-profit organisation headquartered in Bengaluru, India. 
                The Foundation strives to eliminate classroom hunger by implementing the PM POSHAN (Mid-Day Meal) Programme.
              </p>
              
              <p className="text-gray-600 mb-8 leading-relaxed">
                We provide nutritious meals to children studying in government schools and government-aided schools. 
                Akshaya Patra also aims to counter malnutrition and support the Right to Education of children 
                hailing from socio-economically challenging backgrounds.
              </p>
            </div>
            
            {/* Vision & Mission Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Vision Card */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-[#50C779] transition duration-300">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 bg-[#50C779]/10 rounded-full flex items-center justify-center mr-3">
                    <svg className="h-5 w-5 text-[#50C779]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Our Vision</h3>
                </div>
                <p className="text-gray-600">
                  No child in India shall be deprived of education because of hunger
                </p>
              </div>
              
              {/* Mission Card */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-[#50C779] transition duration-300">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 bg-[#50C779]/10 rounded-full flex items-center justify-center mr-3">
                    <svg className="h-5 w-5 text-[#50C779]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Our Mission</h3>
                </div>
                <p className="text-gray-600">
                  To feed 3 million children everyday by 2025
                </p>
              </div>
            </div>
            
            {/* Read More Button & Stats */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <button className="bg-[#50C779] hover:bg-[#3EAE66] text-white px-8 py-3 rounded-xl font-semibold transition duration-300 shadow-lg hover:shadow-xl">
                Read More About Us
              </button>
              
              {/* Small Stats */}
              <div className="flex gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">20+</div>
                  <div className="text-sm text-gray-600">Years</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">60+</div>
                  <div className="text-sm text-gray-600">Kitchens</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">22</div>
                  <div className="text-sm text-gray-600">States</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;