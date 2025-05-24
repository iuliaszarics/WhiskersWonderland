import React from 'react';

function Contact() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-4xl font-bold mb-4 text-gray-700">Contact Us</h1>
      <p className="text-lg text-gray-600 p-10 font-medium">Email: <a href="whiskerswonderland@shelter.com" className="text-blue-500 p-10 underline">contact@shelter.com</a></p>
      <p className="text-lg text-gray-600 p-10 font-medium">Phone: 0763636363</p>
    </div>
  );
}

export default Contact;
