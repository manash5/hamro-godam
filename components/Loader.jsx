import React from 'react';

function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-8 gap-4 h-full w-full p-8">
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} className="bg-blue-600 rounded-sm"></div>
          ))}
        </div>
      </div>

      {/* Main Loader Container */}
      <div className="relative flex flex-col items-center z-10">
        {/* Spinning Blue Box */}
        <div className="mb-8">
          <div 
            className="w-16 h-16 bg-gradient-to-br from-[#030924] to-blue-900 rounded-lg shadow-lg border border-blue-700"
            style={{
              animation: 'spin 1s linear infinite'
            }}
          />
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-900 bg-clip-text text-transparent mb-2">
            Hamro Godam
          </h2>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-slate-600 font-medium">Loading</span>
            <div className="flex space-x-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                  style={{
                    animation: `pulse 1.5s ease-in-out infinite`,
                    animationDelay: `${i * 0.3}s`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}

export default Loader;