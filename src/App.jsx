import { useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { api } from './services/api';
import Layout from './components/Layout';
import AudioPlayer from './components/AudioPlayer';

import FilePage from './components/FilePage';

function App() {
  const [playlist, setPlaylist] = useState([]); // Currently visible/active playlist
  const [currentFile, setCurrentFile] = useState(null);
  const [initialTime, setInitialTime] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const handlePlay = useCallback((file, params = {}) => { // params can be { startTime: 123 }
    setCurrentFile(file);
    if (params.startTime !== undefined) {
      setInitialTime(params.startTime);
    } else {
      setInitialTime(0);
    }
  }, []);

  const handleFilesLoaded = useCallback((files) => {
    setPlaylist(files);
  }, []);

  const handleNext = () => {
    if (!currentFile || playlist.length === 0) return;
    const idx = playlist.findIndex(f => f.id === currentFile.id);
    if (idx !== -1 && idx < playlist.length - 1) {
      setCurrentFile(playlist[idx + 1]);
    }
  };

  const handlePrev = () => {
    if (!currentFile || playlist.length === 0) return;
    const idx = playlist.findIndex(f => f.id === currentFile.id);
    if (idx !== -1 && idx > 0) {
      setCurrentFile(playlist[idx - 1]);
    }
  };

  return (
    <BrowserRouter>
      <Layout searchQuery={searchQuery} onSearch={setSearchQuery}>

        <Routes>
          <Route
            path="/"
            element={
              <FilePage
                fetchMethod={api.getFiles}
                onPlay={handlePlay}
                onFilesLoaded={handleFilesLoaded}
                currentFileId={currentFile?.id}
                filter={searchQuery}
              />
            }
          />
          <Route
            path="/knyga-krisna"
            element={
              <FilePage
                fetchMethod={api.getKrishnaFiles}
                onPlay={handlePlay}
                onFilesLoaded={handleFilesLoaded}
                currentFileId={currentFile?.id}
                filter={searchQuery}
              />
            }
          />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <AudioPlayer
          currentFile={currentFile}
          onNext={handleNext}
          onPrev={handlePrev}
          initialTime={initialTime}
        />
      </Layout>
    </BrowserRouter>
  )
}

export default App
