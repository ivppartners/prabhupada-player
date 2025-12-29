import { useState, useEffect } from 'react'
import { api } from './services/api';
import { saveLastPlayed, getLastPlayed } from './utils/storage';
import Layout from './components/Layout';
import FileList from './components/FileList';
import AudioPlayer from './components/AudioPlayer';

function App() {
  const [files, setFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialTime, setInitialTime] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await api.getFiles();
      setFiles(data);
      setLoading(false);
    };
    loadData();
  }, []);

  // Handle shared file URL parameter and localStorage restoration
  useEffect(() => {
    if (files.length === 0) return;

    const urlParams = new URLSearchParams(window.location.search);
    const fileId = urlParams.get('fileId');

    // URL parameters take precedence over localStorage
    if (fileId) {
      const file = files.find(f => f.id === fileId);
      if (file) {
        setCurrentFile(file);
        setInitialTime(0); // Start from beginning for shared URLs
        // Clean up URL without reloading the page
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } else {
      // If no URL parameter, check localStorage
      const lastPlayed = getLastPlayed();
      if (lastPlayed) {
        const file = files.find(f => f.id === lastPlayed.fileId);
        if (file) {
          setCurrentFile(file);
          setInitialTime(lastPlayed.currentTime);
        }
      }
    }
  }, [files]);

  const handlePlay = (file) => {
    setCurrentFile(file);
    setInitialTime(0); // Start from beginning when manually selecting a file
  };

  const handleNext = () => {
    if (!currentFile || files.length === 0) return;
    const idx = files.findIndex(f => f.id === currentFile.id);
    if (idx < files.length - 1) {
      setCurrentFile(files[idx + 1]);
    }
  };

  const handlePrev = () => {
    if (!currentFile || files.length === 0) return;
    const idx = files.findIndex(f => f.id === currentFile.id);
    if (idx > 0) {
      setCurrentFile(files[idx - 1]);
    }
  };

  return (
    <Layout>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <FileList
          files={files}
          onPlay={handlePlay}
          currentFileId={currentFile?.id}
        />
      )}

      <AudioPlayer
        currentFile={currentFile}
        onNext={handleNext}
        onPrev={handlePrev}
        initialTime={initialTime}
      />
    </Layout>
  )
}

export default App
