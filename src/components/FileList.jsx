import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatDate } from '../utils/format';

const FileList = ({ files, onPlay, currentFileId }) => {
    const [sortConfig, setSortConfig] = useState({ key: 'uploadDate', direction: 'descending' });
    const [filter, setFilter] = useState('');

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
                if (a[sortConfig.key] === null || a[sortConfig.key] === undefined || a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (b[sortConfig.key] === null || b[sortConfig.key] === undefined || a[sortConfig.key] > b[sortConfig.key]) {
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
        <div className="w-full bg-gray-800 rounded-xl shadow-lg border-opacity-0 overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900/50">

                <input
                    type="text"
                    placeholder="Ieškoti įrašų..."
                    className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full text-sm transiton-all"
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-8 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-800 border-b border-gray-700 w-full select-none">
                <div className="col-span-2 md:col-span-1 text-center">Groti</div>
                <div className="col-span-6 md:col-span-4 cursor-pointer hover:text-white flex items-center gap-2" onClick={() => requestSort('title')}>
                    Pavadinimas <FontAwesomeIcon icon={getSortIcon('title')} />
                </div>
                <div className="hidden md:block md:col-span-2 cursor-pointer hover:text-white flex items-center gap-2" onClick={() => requestSort('recordDate')}>
                    Įrašo data <FontAwesomeIcon icon={getSortIcon('recordDate')} />
                </div>
                <div className="col-span-4 md:col-span-2 cursor-pointer hover:text-white flex items-center gap-2" onClick={() => requestSort('uploadDate')}>
                    Įkelta <FontAwesomeIcon icon={getSortIcon('uploadDate')} />
                </div>
                <div className="hidden md:block md:col-span-3">Aprašymas</div>
            </div>

            {/* List */}
            <div className="divide-y divide-gray-700 max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar w-full">
                {sortedFiles.map((file) => (
                    <div
                        key={file.id}
                        className={`grid grid-cols-12 gap-4 py-4 px-8 items-center hover:bg-gray-700/50 transition-colors group ${currentFileId === file.id ? 'bg-indigo-900/30 border-l-4 border-indigo-500' : 'border-l-4 border-transparent'}`}
                    >
                        <div className="col-span-2 md:col-span-1 text-center">
                            <button
                                onClick={() => onPlay(file)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${currentFileId === file.id ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/50' : 'bg-gray-700 text-gray-400 group-hover:bg-indigo-600 group-hover:text-white'}`}
                            >
                                <FontAwesomeIcon icon={currentFileId === file.id ? "music" : "play"} />
                            </button>
                        </div>

                        <div className="col-span-6 md:col-span-4">
                            <div className="font-medium text-white truncate text-sm">{file.title || 'Be pavadinimo'}</div>
                            <div className="text-xs text-gray-400 truncate">{file.location} • {file.book}</div>
                        </div>

                        <div className="hidden md:block md:col-span-2 text-sm text-gray-400">{formatDate(file.recordDate) || file.year}</div>
                        <div className="col-span-4 md:col-span-2 text-sm text-gray-400">{formatDate(file.uploadDate)}</div>

                        <div className="hidden md:block md:col-span-3 text-sm text-gray-400 truncate group-hover:text-gray-300" title={file.description}>
                            {file.description}
                        </div>
                    </div>
                ))}

                {sortedFiles.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        Pagal jūsų paiešką įrašų nerasta.
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileList;
