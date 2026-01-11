import React, { useEffect, useRef } from 'react';

const Visualizer = ({ audioRef, isPlaying }) => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceRef = useRef(null);
    const requestRef = useRef(null);

    useEffect(() => {
        if (!audioRef.current || !canvasRef.current) return;

        // Initialize Audio Context only once
        if (!contextRef.current) {
            contextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            analyserRef.current = contextRef.current.createAnalyser();
            analyserRef.current.fftSize = 64; // Low count for chunky bars

            // Connect audio source
            // Note: MediaElementSource can only be created once per element
            try {
                sourceRef.current = contextRef.current.createMediaElementSource(audioRef.current);
                sourceRef.current.connect(analyserRef.current);
                analyserRef.current.connect(contextRef.current.destination);
            } catch (e) {
                // If source already exists (e.g. strict mode re-render), ignore
            }
        }

        const render = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            const bufferLength = analyserRef.current.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            analyserRef.current.getByteFrequencyData(dataArray);

            const width = canvas.width;
            const height = canvas.height;
            const barWidth = (width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < bufferLength; i++) {
                barHeight = (dataArray[i] / 255) * height; // Scale to canvas height

                // Gradient fill
                const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
                gradient.addColorStop(0, '#818cf8'); // Indigo-400
                gradient.addColorStop(1, '#c084fc'); // Purple-400

                ctx.fillStyle = gradient;

                // Rounded tops? Simpler to just draw rects for now, maybe add rounded caps later if needed
                ctx.fillRect(x, height - barHeight, barWidth, barHeight);

                x += barWidth + 2; // Spacing
            }

            if (isPlaying) {
                requestRef.current = requestAnimationFrame(render);
            }
        };

        if (isPlaying) {
            // Resume context if suspended (browser autoplay policy)
            if (contextRef.current.state === 'suspended') {
                contextRef.current.resume();
            }
            render();
        } else {
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
