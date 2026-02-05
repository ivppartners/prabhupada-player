import prabhupadaImg from '../assets/prabhupada.png';
import Navigation from './Navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Layout = ({ children, searchQuery, onSearch }) => {
    return (
        <div className="min-h-screen bg-[#121212] text-white font-sans selection:bg-indigo-500 selection:text-white">
            <header className="bg-black/40 border-b border-gray-800 py-0 md:py-6">
                <div className="ml-8 mr-4">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
                        <div className="relative mb-3 md:mb-0 md:mr-8 w-full md:w-auto">
                            <img src={prabhupadaImg} alt="Prabhupada" className="hidden md:block h-[150px] md:h-[350px] w-full md:w-auto rounded-lg object-cover object-top shadow-2xl scale-x-[-1]" />
                            {/* Mobile Navigation & Search */}
                            <div className="md:hidden w-full flex flex-col gap-4 mt-2">
                                <Navigation className="" />
                                <div className="relative w-full">
                                    <FontAwesomeIcon icon="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="Ieškoti įrašų..."
                                        value={searchQuery}
                                        className="w-full bg-gray-800/50 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 border border-white/5 transition-all placeholder-gray-500"
                                        onChange={(e) => onSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="text-center md:text-left hidden md:block">
                            <h1 className="text-4xl font-bold text-indigo-400 mb-6">
                                Prabhupados paskaitos lietuvių kalba
                            </h1>
                            {/* Desktop Navigation */}
                            <Navigation className="justify-start" />

                            <div className="relative w-full max-w-md mt-6 hidden md:block">
                                <FontAwesomeIcon icon="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Ieškoti įrašų..."
                                    value={searchQuery}
                                    className="w-full bg-gray-800/50 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 border border-white/5 transition-all placeholder-gray-500"
                                    onChange={(e) => onSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </header >
            <main className="py-4 md:py-8 ml-8 mr-4">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div >
    );
};

export default Layout;
