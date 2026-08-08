import React, { useEffect, useRef } from 'react';

const Visualizer = ({ audioRef, isPlaying }) => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceRef = useRef(null);
    const requestRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        // Detect iOS WebKit devices (iPhone, iPad, iPod)
        const isIOS = typeof navigator !== 'undefined' && (
            /iPad|iPhone|iPod/.test(navigator.userAgent) ||
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
        );

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // On iOS, routing <audio> element through AudioContext (createMediaElementSource)
        // forces WebKit to treat playback as Web Audio API, which iOS strictly suspends
        // when screen turns off. To keep audio playing in background on iPhone, we use a
        // simulated visualizer on iOS instead of Web Audio API node coupling.
        if (isIOS) {
            let step = 0;
            const renderSimulated = () => {
                if (!canvas) return;
                const width = canvas.width;
                const height = canvas.height;
                const bufferLength = 32;
                const barWidth = (width / bufferLength) * 2.5;
                let x = 0;

                ctx.clearRect(0, 0, width, height);
                step += 0.08;

                for (let i = 0; i < bufferLength; i++) {
                    const noise = Math.sin(step + i * 0.4) * 0.4 + Math.cos(step * 0.7 + i) * 0.3 + 0.5;
                    const barHeight = Math.max(4, noise * height * 0.85);

                    const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
                    gradient.addColorStop(0, '#818cf8');
                    gradient.addColorStop(1, '#c084fc');

                    ctx.fillStyle = gradient;
                    ctx.fillRect(x, height - barHeight, barWidth, barHeight);
                    x += barWidth + 2;
                }

                if (isPlaying) {
                    requestRef.current = requestAnimationFrame(renderSimulated);
                }
            };

            if (isPlaying) {
                renderSimulated();
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                if (requestRef.current) cancelAnimationFrame(requestRef.current);
            }

            return () => {
                if (requestRef.current) cancelAnimationFrame(requestRef.current);
            };
        }

        // Standard Web Audio API for non-iOS devices (Android, Desktop)
        if (!audioRef.current) return;

        if (!contextRef.current) {
            try {
                contextRef.current = new (window.AudioContext || window.webkitAudioContext)();
                analyserRef.current = contextRef.current.createAnalyser();
                analyserRef.current.fftSize = 64;

                sourceRef.current = contextRef.current.createMediaElementSource(audioRef.current);
                sourceRef.current.connect(analyserRef.current);
                analyserRef.current.connect(contextRef.current.destination);
            } catch (e) {
                // Ignore re-render errors
            }
        }

        const renderReal = () => {
            if (!canvas || !analyserRef.current) return;

            const bufferLength = analyserRef.current.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            analyserRef.current.getByteFrequencyData(dataArray);

            const width = canvas.width;
            const height = canvas.height;
            const barWidth = (width / bufferLength) * 2.5;
            let x = 0;

            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = (dataArray[i] / 255) * height;

                const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
                gradient.addColorStop(0, '#818cf8');
                gradient.addColorStop(1, '#c084fc');

                ctx.fillStyle = gradient;
                ctx.fillRect(x, height - barHeight, barWidth, barHeight);
                x += barWidth + 2;
            }

            if (isPlaying) {
                requestRef.current = requestAnimationFrame(renderReal);
            }
        };

        if (isPlaying) {
            if (contextRef.current && contextRef.current.state === 'suspended') {
                contextRef.current.resume();
            }
            renderReal();
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        }

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [audioRef, isPlaying]);

    return (
        <canvas
            ref={canvasRef}
            width={200}
            height={40}
            className="opacity-50 pointer-events-none absolute bottom-0 right-0 z-0 h-full w-full mask-image-linear-to-t"
            style={{ maskImage: 'linear-gradient(to top, black, transparent)' }}
        />
    );
};

export default Visualizer;
