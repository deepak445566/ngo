import React from "react";
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

const ModernFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6 exo">
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center mb-4">
              <img src="/images/logo.jpg" className="h-18 w-18 rounded-full"/>
              <div>
                <h2 className="text-2xl font-bold exo">Soorveer Yuva</h2>
                <p className="text-gray-400 text-sm">Sangathan Trust</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering underprivileged children and youth through education, 
              nutrition, and shelter since 2008.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[#50C779]">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                <span className="text-sm">N-1405, Aditya world City ghaziabad</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-3 text-gray-400" />
                <span className="text-sm">+91 96672 77348</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-3 text-gray-400" />
                <span className="text-sm">digitalexpressindia@gmail.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Social Links */}
        <div className="flex justify-center space-x-6 mb-8">
          
          <a href="https://www.instagram.com/soorveeryuvasangthan?igsh=MXM1OXBnNmFrZmJycQ==" className="text-gray-400 hover:text-[#50C779] transition">
            <Instagram className="h-5 w-5" />
          </a>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mb-6"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} Soorveer Yuva Sangathan Trust
          </div>
        
        </div>
      </div>
    </footer>
  );
};

export default ModernFooter;