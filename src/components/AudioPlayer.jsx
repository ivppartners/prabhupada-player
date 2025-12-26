import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { api } from '../services/api';
import { formatDuration } from '../utils/format';

const AudioPlayer = ({ currentFile, onNext, onPrev }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        if (currentFile && audioRef.current) {
            audioRef.current.play()
                .then(() => {
                    setIsPlaying(true);
                })
                .catch(e => {
                    console.log("Autoplay prevented:", e);
                    setIsPlaying(false);
                });
        }
    }, [currentFile]);

    const togglePlay = () => {
        if (audioRef.current.paused) {
            audioRef.current.play();
            setIsPlaying(true);
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
    };

    const handleSeek = (e) => {
        const time = parseFloat(e.target.value);
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    };

    const skip = (seconds) => {
        audioRef.current.currentTime += seconds;
    };

    const handleVolumeChange = (e) => {
        const val = parseFloat(e.target.value);
        setVolume(val);
        audioRef.current.volume = val;
        setIsMuted(val === 0);
    };

    const handleShare = async () => {
        const shareUrl = `${window.location.origin}${window.location.pathname}?fileId=${currentFile.id}`;
        try {
            await navigator.clipboard.writeText(shareUrl);
            alert('Nuoroda nukopijuota į kišenę! Pasidalinkite šia nuoroda su kitais, ir jie galės atidaryti ją tiesiogiai.');
        } catch (err) {
            console.error('Failed to copy:', err);
            // Fallback: show the URL in a prompt
            prompt('Kopijuokite šią nuorodą ir padalinkite ją su kitais:', shareUrl);
        }
    };

    if (!currentFile) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4 shadow-2xl z-50 transition-transform duration-300">
            <audio
                ref={audioRef}
                src={api.getStreamUrl(currentFile.id)}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={onNext}
            />

            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4">
                {/* Art & Info */}
                <div className="flex items-center gap-4 w-full md:w-1/4">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg flex items-center justify-center text-white">
                        <FontAwesomeIcon icon="music" size="lg" />
                    </div>
                    <div className="overflow-hidden">
                        <h3 className="font-bold text-white truncate text-lg">{currentFile.title}</h3>
                        <p className="text-sm text-gray-400 truncate">{currentFile.description || 'No description'}</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col items-center w-full md:w-2/4">
                    <div className="flex items-center gap-6 mb-2">
                        <button onClick={onPrev} className="text-gray-400 hover:text-white transition-colors">
                            <FontAwesomeIcon icon="step-backward" size="lg" />
                        </button>
                        <button onClick={() => skip(-10)} className="text-gray-400 hover:text-white text-sm">
                            -10s
                        </button>
                        <button
                            onClick={togglePlay}
                            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform shadow-lg"
                        >
                            <FontAwesomeIcon icon={isPlaying ? "pause" : "play"} size="lg" />
                        </button>
                        <button onClick={() => skip(10)} className="text-gray-400 hover:text-white text-sm">
                            +10s
                        </button>
                        <button onClick={onNext} className="text-gray-400 hover:text-white transition-colors">
                            <FontAwesomeIcon icon="step-forward" size="lg" />
                        </button>
                    </div>

                    <div className="w-full flex items-center gap-3 text-xs text-gray-400 font-mono">
                        <span>{formatDuration(currentTime)}</span>
                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={currentTime}
                            onChange={handleSeek}
                            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:h-2 transition-all"
                        />
                        <span>{formatDuration(duration)}</span>
                    </div>
                </div>

                {/* Volume & Extras */}
                <div className="flex items-center justify-end gap-3 w-full md:w-1/4">
                    <button
                        className="text-gray-400 hover:text-indigo-400 transition-colors"
                        onClick={handleShare}
                        title="Share now playing"
                    >
                        <FontAwesomeIcon icon="share-alt" />
                    </button>
                    <button className="text-gray-400 hover:text-indigo-400 transition-colors" onClick={() => window.open(api.getDownloadUrl(currentFile.id), '_blank')}>
                        <FontAwesomeIcon icon="download" />
                    </button>
                    <FontAwesomeIcon icon={isMuted ? "volume-mute" : "volume-up"} className="text-gray-400" />
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                </div>
            </div>

            {/* Description Box - shown only if description exists */}
            {currentFile.description && (
                <div className="max-w-7xl mx-auto mt-3 px-4">
                    <div className="bg-gray-800/60 border border-gray-700/50 rounded-lg p-3 shadow-inner">
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Aprašymas</div>
                        <div className="text-sm text-gray-200 leading-relaxed whitespace-pre-line">{currentFile.description}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AudioPlayer;
