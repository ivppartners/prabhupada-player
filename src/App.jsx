import { useState, useEffect } from 'react'
import { api } from './services/api';
import Layout from './components/Layout';
import FileList from './components/FileList';
import AudioPlayer from './components/AudioPlayer';

function App() {
  const [files, setFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await api.getFiles();
      setFiles(data);
      setLoading(false);
    };
    loadData();
  }, []);

  // Handle shared file URL parameter
  useEffect(() => {
    if (files.length === 0) return;

    const urlParams = new URLSearchParams(window.location.search);
    const fileId = urlParams.get('fileId');

    if (fileId) {
      const file = files.find(f => f.id === fileId);
      if (file) {
        setCurrentFile(file);
        // Clean up URL without reloading the page
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [files]);

  const handlePlay = (file) => {
    setCurrentFile(file);
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
      />
    </Layout>
  )
}

export default App
