import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatDate } from '../utils/format';
import { motion, AnimatePresence } from 'framer-motion';
import prabhupadaImg from '../assets/prabhupada.png';

const FileList = ({ files, onPlay, currentFileId, filter = '' }) => {
    const location = useLocation();

    // Determine default sort based on route
    const isKrishnaRoute = location.pathname.includes('knyga-krisna');
    const defaultSortKey = isKrishnaRoute ? 'chapter' : 'uploadDate';
    const defaultSortDirection = isKrishnaRoute ? 'ascending' : 'descending';

    const [sortConfig, setSortConfig] = useState({ key: defaultSortKey, direction: defaultSortDirection });

    // Update sort config if location changes (for when the component doesn't unmount)
    useEffect(() => {
        setSortConfig({
            key: isKrishnaRoute ? 'chapter' : 'uploadDate',
            direction: isKrishnaRoute ? 'ascending' : 'descending'
        });
    }, [isKrishnaRoute]);

    const sortedFiles = useMemo(() => {
        let sortableFiles = [...files];
        if (filter) {
            sortableFiles = sortableFiles.filter(f =>
                f.title.toLowerCase().includes(filter.toLowerCase()) ||
                f.description?.toLowerCase().includes(filter.toLowerCase()) ||
                f.location?.toLowerCase().includes(filter.toLowerCase())
            );
        }
        if (sortConfig !== null) {
            sortableFiles.sort((a, b) => {
                let valA = a[sortConfig.key];
                let valB = b[sortConfig.key];

                let isAEmpty = valA === null || valA === undefined || valA === '';
                let isBEmpty = valB === null || valB === undefined || valB === '';

                if (isAEmpty && isBEmpty) return 0;
                if (isAEmpty) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (isBEmpty) return sortConfig.direction === 'ascending' ? 1 : -1;

                if (valA < valB) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (valA > valB) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableFiles;
    }, [files, sortConfig, filter]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (name) => {
        if (sortConfig.key !== name) return "sort";
        return sortConfig.direction === 'ascending' ? "sort-up" : "sort-down";
    };

    return (
        <div className="w-full bg-gray-900/40 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/5 overflow-hidden flex flex-col h-full max-h-[80vh] relative">
            {/* Mobile Background Image & Overlay */}
            <div className="absolute inset-0 z-0 md:hidden opacity-100 pointer-events-none"
                style={{
                    backgroundImage: `url(${prabhupadaImg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'top center'
                }}
            />
            <div className="absolute inset-0 z-0 md:hidden bg-black/70 pointer-events-none" />

            {/* Content Container - Ensure z-index is higher than background */}
            <div className="relative z-10 flex flex-col h-full min-h-0">


                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest bg-black/20 border-b border-white/5 w-full select-none sticky top-0 z-10 backdrop-blur-md">
                    <div className="col-span-2 md:col-span-1 text-center">#</div>
                    <div className="col-span-6 md:col-span-4 cursor-pointer hover:text-white flex items-center gap-2 transition-colors" onClick={() => requestSort('title')}>
                        Pavadinimas <FontAwesomeIcon icon={getSortIcon('title')} />
                    </div>
                    {isKrishnaRoute ? (
                        <div className="hidden md:block md:col-span-2 cursor-pointer hover:text-white flex items-center gap-2 transition-colors" onClick={() => requestSort('chapter')}>
                            Skyrius <FontAwesomeIcon icon={getSortIcon('chapter')} />
                        </div>
                    ) : (
                        <div className="hidden md:block md:col-span-2 cursor-pointer hover:text-white flex items-center gap-2 transition-colors" onClick={() => requestSort('recordDate')}>
                            Datavimas <FontAwesomeIcon icon={getSortIcon('recordDate')} />
                        </div>
                    )}
                    <div className="col-span-4 md:col-span-2 cursor-pointer hover:text-white flex items-center gap-2 transition-colors" onClick={() => requestSort('uploadDate')}>
                        Įkelta <FontAwesomeIcon icon={getSortIcon('uploadDate')} />
                    </div>
                    <div className="hidden md:block md:col-span-3">Info</div>
                </div>

                {/* List */}
                <div className="overflow-y-auto custom-scrollbar flex-1 p-2 pb-32 space-y-1 min-h-0">
                    <AnimatePresence>
                        {sortedFiles.map((file, index) => (
                            <motion.div
                                key={file.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.03, duration: 0.2 }}
                                onClick={() => onPlay(file)}
                                className={`grid grid-cols-12 gap-4 py-3 px-6 items-center rounded-xl cursor-pointer group transition-all duration-200 border border-transparent ${currentFileId === file.id
                                    ? 'bg-indigo-600/20 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                                    : 'hover:bg-white/5 hover:border-white/5'
                                    }`}
                            >
                                <div className="col-span-2 md:col-span-1 text-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${currentFileId === file.id
                                        ? 'bg-indigo-500 text-white scale-110 shadow-lg'
                                        : 'bg-gray-800 text-gray-500 group-hover:bg-gray-700 group-hover:text-white'
                                        }`}>
                                        <FontAwesomeIcon icon={currentFileId === file.id ? "chart-bar" : "play"} className={currentFileId === file.id && "animate-pulse"} size="xs" />
                                    </div>
                                </div>

                                <div className="col-span-6 md:col-span-4 min-w-0">
                                    <div className={`font-semibold truncate text-sm transition-colors ${currentFileId === file.id ? 'text-indigo-300' : 'text-gray-200 group-hover:text-white'}`}>
                                        {file.title || 'Be pavadinimo'}
                                    </div>
                                    <div className="text-xs text-gray-500 truncate flex gap-2">
                                        {file.book && <span className="text-indigo-400/80">{file.book}</span>}
                                        {file.location && <span>• {file.location}</span>}
                                    </div>
                                </div>

                                {isKrishnaRoute ? (
                                    <div className="hidden md:block md:col-span-2 text-xs text-center md:text-left text-gray-300 font-medium">
                                        {file.chapter || '-'}
                                    </div>
                                ) : (
                                    <div className="hidden md:block md:col-span-2 text-xs text-gray-500 font-mono">
                                        {formatDate(file.recordDate) || file.year || '-'}
                                    </div>
                                )}

                                <div className="col-span-4 md:col-span-2 text-xs text-gray-500 font-mono">
                                    {formatDate(file.uploadDate)}
                                </div>

                                <div className="hidden md:block md:col-span-3 text-xs text-gray-500 truncate group-hover:text-gray-400 max-w-full">
                                    {file.description}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {sortedFiles.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-12 text-center text-gray-500 flex flex-col items-center gap-4"
                        >
                            <FontAwesomeIcon icon="search" size="2x" className="opacity-20" />
                            <p>Pagal jūsų paiešką įrašų nerasta.</p>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileList;
