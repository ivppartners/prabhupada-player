import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getLastPlayed } from '../utils/storage';

/**
 * Hook to handle deep linking and auto-playing files based on URL or localStorage
 * @param {Array} files - List of available files
 * @param {Function} onPlay - Callback to play a file
 * @param {string} currentFileId - ID of the currently playing file
 * @param {boolean} loading - Loading state
 */
export const useDeepLink = (files, onPlay, currentFileId, loading) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const processedRef = useRef(false);

    useEffect(() => {
        if (loading || files.length === 0 || processedRef.current) return;

        const urlFileId = searchParams.get('fileId');

        if (urlFileId) {
            // Priority 1: URL Parameter
            const file = files.find(f => f.id === urlFileId);
            if (file) {
                if (file.id !== currentFileId) {
                    onPlay(file);
                }
                // Clean URL after successful link
                setSearchParams({}, { replace: true });
                processedRef.current = true;
            }
        } else if (!currentFileId) {
            // Priority 2: LocalStorage (only if nothing is playing)
            const lastPlayed = getLastPlayed();
            if (lastPlayed) {
                const file = files.find(f => f.id === lastPlayed.fileId);
                if (file) {
                    // Check if last played time is valid? 
                    // The player component handles validation usually, but we pass it.
                    onPlay(file, { startTime: lastPlayed.currentTime });
                    processedRef.current = true;
                }
            }
        }
    }, [files, loading, searchParams, currentFileId, onPlay, setSearchParams]);
};
