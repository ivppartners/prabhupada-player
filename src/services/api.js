const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:4001/api' : 'https://prabhupada.lt/api');

/**
 * Maps raw API response to standardized File interface
 * @param {Object} record - Raw DB record
 * @returns {Object} Standardized file object
 */
const mapFile = (record) => ({
    id: record.id,
    title: record.pavadinimas || 'Be pavadinimo',
    uploadDate: record.failo_data,
    recordDate: record.data,
    year: record.metai,
    location: record.vieta,
    book: record.knyga,
    song: record.giesme,
    chapter: record.skyrius,
    verse: record.tekstas,
    description: record.aprasymas,
    // Helper for display
    fullTitle: `${record.pavadinimas || 'Nežinoma'} (${record.metai || '?'})`,
});

export const api = {
    /**
     * Fetch list of all files
     * @returns {Promise<Array>} List of mapped files
     */
    async getFiles() {
        try {
            const response = await fetch(`${API_URL}/published`);
            if (!response.ok) throw new Error('Failed to fetch files');
            const data = await response.json();
            return data.map(mapFile);
        } catch (error) {
            console.error('API Error:', error);
            return [];
        }
    },

    /**
     * Fetch list of Krishna book files
     * @returns {Promise<Array>} List of mapped files
     */
    async getKrishnaFiles() {
        try {
            const response = await fetch(`${API_URL}/krishna`);
            if (!response.ok) throw new Error('Failed to fetch Krishna files');
            const data = await response.json();
            return data.map(mapFile);
        } catch (error) {
            console.error('API Error:', error);
            return [];
        }
    },

    /**
     * Get direct stream URL for audio
     * @param {string} id 
     * @returns {string}
     */
    getStreamUrl(id) {
        return `${API_URL}/play/${id}`;
    },

    /**
     * Get direct download URL
     * @param {string} id 
     * @returns {string}
     */
    getDownloadUrl(id) {
        return `${API_URL}/download/${id}`;
    }
};
