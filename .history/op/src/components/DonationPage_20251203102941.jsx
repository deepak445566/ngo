// components/DonationPage.jsx
import React, { useState } from 'react';
import { Heart, IndianRupee, Shield, Download, Share2, Mail, Phone, Home, Globe, MessageSquare, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

const DonationPage = () => {
  const [donationData, setDonationData] = useState({
    name: '',
    email: '',
    phone: '',
    amount: '',
    customAmount: '',
    address: '',
    message: '',
    anonymous: false,
    transactionId: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const donationAmounts = [101, 501, 1001, 2100, 5100, 11000];

  // Your UPI QR code image
  const qrCodeImage = '/images/upi-qr.jpg';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDonationData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAmountSelect = (amount) => {
    setDonationData(prev => ({
      ...prev,
      amount: amount.toString(),
      customAmount: ''
    }));
  };

  const generateTransactionId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `DON${timestamp.toString().slice(-6)}${random}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const finalAmount = donationData.customAmount || donationData.amount;
    if (!finalAmount) {
      toast.error('Please select or enter donation amount');
      return;
    }

    if (!donationData.name && !donationData.anonymous) {
      toast.error('Please enter your name or select anonymous donation');
      return;
    }

    // Generate transaction ID
    const transactionId = generateTransactionId();
    
    // Show QR payment instructions
    toast.success(
      <div>
        <p className="font-bold">Scan the QR Code to complete donation</p>
        <p className="text-sm">Transaction ID: {transactionId}</p>
        <p className="text-sm">Amount: ₹{finalAmount}</p>
        <p className="text-sm">Please save payment screenshot</p>
      </div>,
      { duration: 8000 }
    );

    // Submit to Web3Forms
    await submitToWeb3Forms({
      ...donationData,
      transactionId,
      amount: finalAmount,
      paymentMethod: 'QR Code',
      paymentStatus: 'pending',
      timestamp: new Date().toISOString()
    });
  };

  const submitToWeb3Forms = async (formData) => {
    setIsSubmitting(true);
    
    try {
      // Replace with your Web3Forms access key
      const accessKey = 'YOUR_WEB3FORMS_ACCESS_KEY';
      
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `QR Donation - ₹${formData.amount} - ${formData.transactionId}`,
          from_name: formData.anonymous ? 'Anonymous Donor' : formData.name,
          name: formData.anonymous ? 'Anonymous Donor' : formData.name,
          email: formData.email || 'No email provided',
          phone: formData.phone || 'No phone provided',
          address: formData.address || 'No address provided',
          message: formData.message || 'No message provided',
          amount: `₹${formData.amount}`,
          customAmount: formData.customAmount ? `₹${formData.customAmount}` : '',
          anonymous: formData.anonymous ? 'Yes' : 'No',
          paymentMethod: 'QR Code',
          transactionId: formData.transactionId,
          paymentStatus: 'pending',
          timestamp: formData.timestamp,
          source: 'Donation Page',
          
          // Optional redirect URL
          // redirect: 'https://yourdomain.com/thank-you',
        })
      });

      const result = await response.json();

      if (result.success) {
        console.log('Donation submitted:', result);
        
        // Show transaction details
        toast.success(
          <div>
            <p className="font-bold">Donation Registered!</p>
            <p className="text-sm">Transaction ID: {formData.transactionId}</p>
            <p className="text-sm">Please complete payment via QR code</p>
          </div>,
          { duration: 6000 }
        );
        
      } else {
        console.error('Submission failed:', result);
        toast.error('Failed to register donation. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Support शूरवीर युवा ट्रस्ट',
          text: `Join me in supporting शूरवीर युवा ट्रस्ट. Donate via QR code to make a difference!`,
          url: window.location.href,
        });
        toast.success('Page shared successfully!');
      } catch (error) {
        console.log('Sharing cancelled:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const downloadQRCode = () => {
    // Create a temporary link to download QR code
    const link = document.createElement('a');
    link.href = qrCodeImage;
    link.download = 'shoorveer-donation-qr.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('QR Code downloaded!');
  };

  const copyUPIID = () => {
    navigator.clipboard.writeText('shoorveer.trust@upi');
    toast.success('UPI ID copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mb-4 shadow-lg">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Support <span className="text-red-600">शूरवीर युवा ट्रस्ट</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Your contribution helps us empower youth, support communities, and create positive change.
            Every donation makes a difference.
          </p>
          <div className="mt-4 inline-flex items-center justify-center px-4 py-2 bg-red-100 text-red-700 rounded-full">
            <span className="font-bold">Payment Method:</span>
            <span className="ml-2 font-semibold">QR Code Only</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Donation Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Heart className="w-6 h-6 mr-3 text-red-500" />
                Make a Donation via QR Code
              </h2>

              <form onSubmit={handleSubmit}>
                {/* Amount Selection */}
                <div className="mb-8">
                  <label className="block text-gray-700 font-medium mb-4">
                    Select Donation Amount (₹)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                    {donationAmounts.map((amount) => (
                      <button
                        type="button"
                        key={amount}
                        onClick={() => handleAmountSelect(amount)}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${
                          donationData.amount === amount.toString()
                            ? 'border-red-500 bg-red-50 text-red-600'
                            : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                        }`}
                      >
                        <div className="flex items-center justify-center">
                          <IndianRupee className="w-4 h-4 mr-1" />
                          <span className="text-xl font-bold">{amount.toLocaleString()}</span>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">One-time</span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-4">
                    <label className="block text-gray-700 mb-2">
                      Or enter custom amount
                    </label>
                    <div className="relative">
                      <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center border-r border-gray-300 bg-gray-50 rounded-l-lg">
                        <IndianRupee className="w-5 h-5 text-gray-500" />
                      </div>
                      <input
                        type="number"
                        name="customAmount"
                        value={donationData.customAmount}
                        onChange={handleChange}
                        placeholder="Enter amount"
                        className="w-full px-4 py-3 pl-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        min="1"
                      />
                    </div>
                  </div>
                </div>

                {/* Personal Details */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Your Details</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 mb-2">
                        <span className="flex items-center">
                          <i className="fas fa-user mr-2 text-blue-500"></i>
                          Full Name *
                        </span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={donationData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={donationData.anonymous}
                        required={!donationData.anonymous}
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">
                        <span className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-green-500" />
                          Phone Number *
                        </span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={donationData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">
                        <span className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-purple-500" />
                          Email Address *
                        </span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={donationData.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">
                        <span className="flex items-center">
                          <Home className="w-4 h-4 mr-2 text-orange-500" />
                          Address (For 80G receipt)
                        </span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={donationData.address}
                        onChange={handleChange}
                        placeholder="Enter your address"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-gray-700 mb-2">
                      <span className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2 text-teal-500" />
                        Message (Optional)
                      </span>
                    </label>
                    <textarea
                      name="message"
                      value={donationData.message}
                      onChange={handleChange}
                      placeholder="Any message for us?"
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="mt-4 flex items-center">
                    <input
                      type="checkbox"
                      id="anonymous"
                      name="anonymous"
                      checked={donationData.anonymous}
                      onChange={handleChange}
                      className="h-5 w-5 text-red-600 rounded focus:ring-red-500"
                    />
                    <label htmlFor="anonymous" className="ml-2 text-gray-700">
                      Donate anonymously (No name on receipt)
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white text-lg font-bold rounded-xl transition transform hover:scale-[1.02] shadow-lg flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-red-700 hover:to-pink-700'}`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Heart className="w-5 h-5 mr-2" />
                      Generate QR Payment
                      <IndianRupee className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>

                {/* Security Note */}
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800 flex items-center">
                    <Shield className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>
                      Your donation is secure and 100% tax deductible under section 80G. 
                      You will receive a receipt for your donation.
                    </span>
                  </p>
                </div>
              </form>
            </div>

            {/* Trust Info */}
            <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl shadow-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <Globe className="w-6 h-6 mr-3" />
                About शूरवीर युवा ट्रस्ट
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="mb-4">
                    शूरवीर युवा ट्रस्ट is dedicated to empowering youth, supporting education, 
                    and creating sustainable community development programs.
                  </p>
                  <p>
                    Your donations support:
                  </p>
                  <ul className="mt-2 space-y-2">
                    <li className="flex items-center">
                      <i className="fas fa-check-circle text-green-400 mr-2"></i>
                      Youth skill development programs
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check-circle text-green-400 mr-2"></i>
                      Educational scholarships
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check-circle text-green-400 mr-2"></i>
                      Community health initiatives
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-3">Contact for Receipt</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 mr-3 text-blue-300" />
                      <span>+91 99232 25066</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 mr-3 text-blue-300" />
                      <span>contact@shoorveer.org</span>
                    </div>
                    <div className="flex items-center">
                      <Home className="w-5 h-5 mr-3 text-blue-300" />
                      <span>Shoorveer Yuva Trust, India</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - QR Code Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* QR Code Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Scan QR Code to Donate
                </h2>

                <div className="text-center mb-6">
                  <div className="inline-block p-4 bg-gray-50 rounded-2xl border-2 border-gray-200">
                    <img
                      src={qrCodeImage}
                      alt="UPI QR Code for Donation"
                      className="w-64 h-64 mx-auto rounded-lg"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-3">
                    Scan with any UPI app (GPay, PhonePe, Paytm, etc.)
                  </p>
                </div>

                {/* UPI ID */}
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2 font-medium">UPI ID</label>
                  <div className="flex">
                    <input
                      type="text"
                      value="shoorveer.trust@upi"
                      readOnly
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg bg-gray-50 font-medium"
                    />
                    <button
                      type="button"
                      onClick={copyUPIID}
                      className="px-4 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition flex items-center"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <button
                    onClick={downloadQRCode}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition flex items-center justify-center"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download QR Code
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className="w-full py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center justify-center"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Share Donation Page
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl shadow-xl p-6 md:p-8 border border-amber-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <i className="fas fa-info-circle text-amber-600 mr-2"></i>
                  Payment Instructions
                </h3>
                <ol className="space-y-4">
                  <li className="flex">
                    <div className="flex-shrink-0 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center mr-3 mt-1">
                      1
                    </div>
                    <span>Fill donation form and submit</span>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center mr-3 mt-1">
                      2
                    </div>
                    <span>Scan QR code with any UPI app</span>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center mr-3 mt-1">
                      3
                    </div>
                    <span>Enter the amount and complete payment</span>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center mr-3 mt-1">
                      4
                    </div>
                    <span>Save payment screenshot</span>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center mr-3 mt-1">
                      5
                    </div>
                    <span>Share screenshot with us for receipt</span>
                  </li>
                </ol>

                <div className="mt-6 p-4 bg-amber-100 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> After payment, WhatsApp screenshot to +91 99232 25066 
                    with your Transaction ID for 80G receipt.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
            What Donors Say
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Rajesh Kumar",
                amount: "₹5,100",
                text: "QR code payment was seamless. Received receipt quickly via WhatsApp."
              },
              {
                name: "Priya Sharma",
                amount: "₹1,001",
                text: "Easy QR payment process. Trusted organization with transparent system."
              },
              {
                name: "Amit Patel",
                amount: "₹2,100",
                text: "Simple QR scan payment. Got 80G receipt within 24 hours."
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">{testimonial.name}</div>
                    <div className="text-red-600 font-semibold">{testimonial.amount}</div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationPage;