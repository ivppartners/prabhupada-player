import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';

const Navigation = () => {
    return (
        <nav className="mb-8 flex justify-center sticky top-4 z-40">
            <div className="bg-gray-900/60 backdrop-blur-xl p-1.5 rounded-2xl inline-flex shadow-2xl border border-white/10 relative">
                {[
                    { to: "/", icon: "microphone-alt", label: "Paskaitos" },
                    { to: "/knyga-krisna", icon: "book-open", label: "Knyga Krišna" }
                ].map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `relative px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 z-10 ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}`
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
