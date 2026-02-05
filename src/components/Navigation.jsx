import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';

const Navigation = ({ className = "" }) => {
    return (
        <nav className={`flex justify-center ${className}`}>
            <div className="bg-gray-900/60 backdrop-blur-xl p-1.5 md:rounded-2xl rounded-b-lg rounded-t-none w-full md:w-auto grid grid-cols-2 md:flex md:inline-flex justify-items-center md:justify-center shadow-2xl border border-white/10 relative">
                {[
                    { to: "/", icon: "microphone-alt", label: "Paskaitos" },
                    { to: "/knyga-krisna", icon: "book-open", label: "Knyga Krišna" }
                ].map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `relative px-4 py-2 md:px-6 md:py-3 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 flex items-center gap-2 z-10 w-full justify-center md:w-auto ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-indigo-600 shadow-lg rounded-xl -z-10"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <FontAwesomeIcon icon={item.icon} />
                                <span>{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

export default Navigation;
