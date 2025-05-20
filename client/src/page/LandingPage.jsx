import React from 'react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] text-white font-sans">
      
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center py-24 px-6 sm:px-12 md:px-20 lg:px-32">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-2xl rounded-b-3xl shadow-2xl z-0" />
        <div className="relative z-10 max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
            Welcome to <span className="text-blue-400">Zoom Clone</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 text-gray-300 leading-relaxed">
            Connect, collaborate, and create amazing experiences with secure video conferencing.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/signup"
              className="bg-blue-500/20 text-blue-300 hover:text-white hover:bg-blue-500/30 py-3 px-8 rounded-lg backdrop-blur-md transition duration-300 font-medium border border-blue-400/30 shadow-lg hover:shadow-blue-500/30"
            >
              Get Started
            </a>
            <a
              href="/login"
              className="bg-white/5 hover:bg-white/10 text-white py-3 px-8 rounded-lg backdrop-blur-md transition duration-300 border border-white/20 shadow-lg hover:shadow-white/10"
            >
              Log In
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 sm:px-12 lg:px-32">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-14 text-white">
          Why Choose Zoom Clone?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: 'High-Quality Video',
              desc: 'Enjoy seamless video conferencing with HD quality, even with large groups.',
            },
            {
              title: 'Screen Sharing',
              desc: 'Share your screen with others for better collaboration and presentations.',
            },
            {
              title: 'Secure Meetings',
              desc: 'End-to-end encryption ensures your meetings are secure and private.',
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="p-6 bg-white/5 border border-white/10 rounded-2xl shadow-xl text-center backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <h3 className="text-xl font-semibold mb-3 text-blue-300">{feature.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-transparent border-t border-white/10 text-gray-500 py-6 mt-auto text-center">
        <p className="text-sm">&copy; 2025 <span className="text-white font-medium">Zoom Clone</span>. All rights reserved.</p>
      </footer>
    </div>
  );
}