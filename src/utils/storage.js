const LAST_PLAYED_KEY = 'prabhupada-player-last-played';

/**
 * Save the last played file and its current playback position
 * @param {string} fileId - The ID of the file being played
 * @param {number} currentTime - The current playback position in seconds
 */
export const saveLastPlayed = (fileId, currentTime) => {
    try {
        const data = {
            fileId,
            currentTime,
            timestamp: Date.now()
        };
        localStorage.setItem(LAST_PLAYED_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Failed to save last played to localStorage:', error);
    }
};

/**
 * Retrieve the last played file and position from localStorage
 * @returns {{fileId: string, currentTime: number} | null}
 */
export const getLastPlayed = () => {
    try {
        const data = localStorage.getItem(LAST_PLAYED_KEY);
        if (!data) return null;

        const parsed = JSON.parse(data);
        return {
            fileId: parsed.fileId,
            currentTime: parsed.currentTime || 0
        };
    } catch (error) {
        console.error('Failed to retrieve last played from localStorage:', error);
        return null;
    }
};

/**
 * Clear the last played data from localStorage
 */
export const clearLastPlayed = () => {
    try {
        localStorage.removeItem(LAST_PLAYED_KEY);
    } catch (error) {
        console.error('Failed to clear last played from localStorage:', error);
    }
};
