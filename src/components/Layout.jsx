import prabhupadaImg from '../assets/prabhupada.png';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#121212] text-white font-sans selection:bg-indigo-500 selection:text-white">
            <header className="bg-black/40 border-b border-gray-800 py-0 md:py-6">
                <div className="ml-8 mr-4">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
                        <img src={prabhupadaImg} alt="Prabhupada" className="h-[250px] md:h-[350px] w-auto rounded-lg mb-3 md:mb-0 md:mr-8 object-cover object-top shadow-2xl scale-x-[-1]" />
                        <h1 className="text-4xl font-bold text-indigo-400 text-center md:text-left hidden md:block">
                            Prabhupados paskaitos lietuvių kalba
                        </h1>
                    </div>
                </div>
            </header>
            <main className="py-4 md:py-8 ml-8 mr-4">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
