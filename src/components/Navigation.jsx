import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Navigation = ({ className = "" }) => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <nav className={`flex justify-center ${className}`}>
            <div className="bg-gray-900/60 backdrop-blur-xl p-1.5 md:rounded-2xl rounded-b-lg rounded-t-none w-full md:w-auto grid grid-cols-2 md:flex md:inline-flex justify-items-center md:justify-center shadow-2xl border border-white/10 relative">
                {[
                    { to: "/", icon: "microphone-alt", label: "Paskaitos" },
                    { to: "/knyga-krisna", icon: "book-open", label: "Knyga Krišna" }
                ].map((item) => {
                    const isActive = location.pathname === item.to;
                    return (
                        <button
                            key={item.to}
                            onClick={() => navigate(item.to)}
                            className={`relative px-4 py-2 md:px-6 md:py-3 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 flex items-center gap-2 z-10 w-full justify-center md:w-auto cursor-pointer touch-manipulation ${
                                isActive 
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <FontAwesomeIcon icon={item.icon} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default Navigation;
