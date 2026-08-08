import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { api } from '../services/api';
import { formatDuration } from '../utils/format';
import { saveLastPlayed } from '../utils/storage';
import { motion, AnimatePresence } from 'framer-motion';
import Visualizer from './Visualizer';

const AudioPlayer = ({ currentFile, onNext, onPrev, initialTime = 0 }) => {
    const audioRef = useRef(null);
    const progressBarRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
    const [audioError, setAudioError] = useState(null);


    const pendingInitialTimeRef = useRef(initialTime);

    useEffect(() => {
        pendingInitialTimeRef.current = initialTime;
    }, [initialTime]);

    // Load and play file when currentFile changes
    useEffect(() => {
        setAudioError(null);
        if (currentFile && audioRef.current) {
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(e => {
                    console.log("Autoplay prevented:", e);
                    setIsPlaying(false);
                });
        }
    }, [currentFile]);

    // Save playback position
    useEffect(() => {
        if (!currentFile || !isPlaying) return;
        const interval = setInterval(() => {
            if (audioRef.current && currentFile) {
                saveLastPlayed(currentFile.id, audioRef.current.currentTime);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [currentFile, isPlaying]);

    // MediaSession API setup for lock screen controls & background playback
    useEffect(() => {
        if (!currentFile || !('mediaSession' in navigator)) return;

        try {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentFile.title || 'Paskaita',
                artist: 'A.C. Bhaktivedanta Swami Prabhupada',
                album: 'Prabhupados paskaitos lietuvių kalba',
                artwork: [
                    { src: '/prabhupada.ico', sizes: '96x96', type: 'image/x-icon' }
                ]
            });

            navigator.mediaSession.setActionHandler('play', () => {
                if (audioRef.current) {
                    audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
                }
            });

            navigator.mediaSession.setActionHandler('pause', () => {
                if (audioRef.current) {
                    audioRef.current.pause();
                    setIsPlaying(false);
                }
            });

            if (onPrev) {
                navigator.mediaSession.setActionHandler('previoustrack', onPrev);
            }
            if (onNext) {
                navigator.mediaSession.setActionHandler('nexttrack', onNext);
            }

            navigator.mediaSession.setActionHandler('seekto', (details) => {
                if (details.seekTime !== undefined && audioRef.current) {
                    audioRef.current.currentTime = details.seekTime;
                    setCurrentTime(details.seekTime);
                }
            });
        } catch (e) {
            console.warn("MediaSession initialization failed:", e);
        }
    }, [currentFile, onNext, onPrev]);

    // Update MediaSession playback state
    useEffect(() => {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
        }
    }, [isPlaying]);

    // Update MediaSession position state for seek bar on lock screen
    useEffect(() => {
        if ('mediaSession' in navigator && 'setPositionState' in navigator.mediaSession && duration > 0) {
            try {
                navigator.mediaSession.setPositionState({
                    duration: duration,
                    playbackRate: audioRef.current?.playbackRate || 1,
                    position: currentTime
                });
            } catch (e) {
                // Ignore edge case errors when position > duration
            }
        }
    }, [currentTime, duration]);

    const togglePlay = () => {
        if (audioRef.current.paused) {
            audioRef.current.play();
            setIsPlaying(true);
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleTimeUpdate = () => setCurrentTime(audioRef.current.currentTime);
    
    const handleLoadedMetadata = () => {
        if (!audioRef.current) return;
        const dur = audioRef.current.duration;
        setDuration(dur);
        if (pendingInitialTimeRef.current > 0 && pendingInitialTimeRef.current < dur) {
            audioRef.current.currentTime = pendingInitialTimeRef.current;
            setCurrentTime(pendingInitialTimeRef.current);
            pendingInitialTimeRef.current = 0;
        }
    };

    const handleSeek = (e) => {
        if (!progressBarRef.current || !audioRef.current) return;

        const totalDuration = audioRef.current.duration || duration;
        if (!totalDuration || !isFinite(totalDuration) || totalDuration <= 0) return;

        let clientX;
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
        } else if (e.changedTouches && e.changedTouches.length > 0) {
            clientX = e.changedTouches[0].clientX;
        } else if (typeof e.clientX === 'number') {
            clientX = e.clientX;
        }

        if (clientX === undefined || clientX === null) return;

        const rect = progressBarRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = Math.min(Math.max(x / rect.width, 0), 1);
        const time = percentage * totalDuration;

        if (isFinite(time) && time >= 0) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
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
            alert('Nuoroda nukopijuota!');
        } catch (err) {
            prompt('Kopijuoti nuorodą:', shareUrl);
        }
    };

    const handleAudioError = (e) => {
        console.error("Audio error:", e);
        setAudioError("Nepavyko paleisti audio įrašo. Patikrinkite ryšį arba failą.");
        setIsPlaying(false);
    };


    if (!currentFile) return null;

    const progressPercent = duration ? (currentTime / duration) * 100 : 0;

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none" // pointer-events-none ensures only children capture clicks if needed, but container needs events for glass effect? 
        // Wait, we want the player to be clickable. pointer-events-auto on the content.
        >
            {/* Main Player Container */}
            {/* Main Player Container - overflow must be visible for progress thumb and visualizer should be clipped if needed, but visualizer is absolute. Providing specific clip for visualizer? No, let's just make main container relative. */}
            <div className="bg-gray-900/80 backdrop-blur-xl border-t border-white/10 shadow-2xl pb-safe pointer-events-auto relative">

                {/* Visualizer Background - Clipped */}
                <div className="absolute inset-0 pointer-events-none z-0 opacity-20 overflow-hidden rounded-t-xl">
                    <Visualizer audioRef={audioRef} isPlaying={isPlaying} />
                </div>

                 <audio
                    ref={audioRef}
                    crossOrigin="anonymous"
                    playsInline
                    src={api.getStreamUrl(currentFile.id)}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={onNext}
                    onError={handleAudioError}
                />

                {/* Audio Error Alert Banner */}
                {audioError && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-600/90 text-white text-xs px-4 py-1.5 rounded-full shadow-lg border border-red-500/20 backdrop-blur-md z-40 flex items-center gap-2 animate-bounce pointer-events-auto">
                        <FontAwesomeIcon icon="exclamation-triangle" />
                        <span>{audioError}</span>
                    </div>
                )}

                {/* Progress Bar (Top Edge) - Thicker and interactive */}
                <div
                    className="absolute -top-1 left-0 w-full h-2 bg-gray-600/50 cursor-pointer group z-30 hover:h-3 transition-all touch-none"
                    onClick={handleSeek}
                    onTouchStart={handleSeek}
                    onTouchMove={handleSeek}
                    ref={progressBarRef}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >

                    <motion.div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 relative"
                        style={{ width: `${progressPercent}%` }}
                    >
                        <motion.div
                            className={`absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg transform scale-0 group-hover:scale-100 transition-transform origin-center`}
                        />
                    </motion.div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center gap-4 relative z-10">

                    {/* Art & Info */}
                    <div className="flex items-center gap-4 w-full md:w-1/4">
                        <motion.div
                            className="w-14 h-14 bg-gradient-to-br from-indigo-500/80 to-purple-600/80 rounded-xl shadow-lg flex items-center justify-center text-white backdrop-blur-md border border-white/10"
                            animate={{ rotate: isPlaying ? 360 : 0 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear", paused: !isPlaying }}
                        >
                            <FontAwesomeIcon icon="music" className="text-xl" />
                        </motion.div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-white text-base leading-tight pr-2">{currentFile.title}</h3>
                            <p className="text-xs text-indigo-300 truncate">{formatDuration(currentTime)} / {formatDuration(duration)}</p>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col items-center justify-center w-full md:w-2/4">
                        <div className="flex items-center gap-8">
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={onPrev}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <FontAwesomeIcon icon="step-backward" size="lg" />
                            </motion.button>

                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={togglePlay}
                                className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                            >
                                <FontAwesomeIcon icon={isPlaying ? "pause" : "play"} className="ml-0.5" />
                            </motion.button>

                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={onNext}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <FontAwesomeIcon icon="step-forward" size="lg" />
                            </motion.button>
                        </div>
                    </div>

                    {/* Volume & Extras */}
                    <div className="flex items-center justify-end gap-3 w-full md:w-1/4">
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-500 hidden md:block"
                        />
                        <button className="text-gray-400 hover:text-indigo-400 transition-colors p-2" onClick={handleShare}>
                            <FontAwesomeIcon icon="share-alt" />
                        </button>
                        <button className="text-gray-400 hover:text-indigo-400 transition-colors p-2" onClick={() => window.open(api.getDownloadUrl(currentFile.id), '_blank')}>
                            <FontAwesomeIcon icon="download" />
                        </button>
                        <button
                            className={`text-gray-400 hover:text-indigo-400 transition-colors p-2 ${isDescriptionVisible ? 'text-indigo-400' : ''}`}
                            onClick={() => setIsDescriptionVisible(!isDescriptionVisible)}
                            title={isDescriptionVisible ? "Slėpti aprašymą" : "Rodyti aprašymą"}
                        >
                            <FontAwesomeIcon icon="info-circle" />
                        </button>
                    </div>
                </div>

                {/* Description Box - shown only if description exists and is visible */}
                <AnimatePresence>
                    {currentFile.description && isDescriptionVisible && (
                        <div className="max-w-7xl mx-auto px-4 pb-3 relative z-10">
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="bg-black/20 rounded-lg p-3 border border-white/5"
                            >
                                <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wide mb-1">Aprašymas</div>
                                <div className="text-sm text-gray-200 leading-relaxed whitespace-pre-line">{currentFile.description}</div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div >
    );
};

export default AudioPlayer;
