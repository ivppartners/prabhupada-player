import React, { useState, useEffect } from 'react';
import FileList from './FileList';
import { useDeepLink } from '../hooks/useDeepLink';

const FilePage = ({ fetchMethod, onPlay, onFilesLoaded, currentFileId, filter }) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);


    // Fetch files on mount or when fetchMethod changes
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const data = await fetchMethod();
            setFiles(data);
            if (onFilesLoaded) {
                onFilesLoaded(data);
            }
            setLoading(false);
        };
        loadData();
    }, [fetchMethod, onFilesLoaded]);

    // Handle deep linking and state restoration
    useDeepLink(files, onPlay, currentFileId, loading);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <FileList
            files={files}
            onPlay={(file) => onPlay(file)} // Play from start by default when clicking
            currentFileId={currentFileId}
            filter={filter}
        />
    );
};

export default FilePage;
