import React, { useEffect, useState } from 'react';

const CursorGlow = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const updatePosition = (e) => {
            requestAnimationFrame(() => {
                setPosition({ x: e.clientX, y: e.clientY });
            });
        };

        window.addEventListener('mousemove', updatePosition);
        return () => window.removeEventListener('mousemove', updatePosition);
    }, []);

    return (
        <div
            className="pointer-events-none fixed inset-0 z-[1] transition-opacity duration-300"
            style={{
                background: `radial-gradient(300px at ${position.x}px ${position.y}px, rgba(45, 212, 191, 0.15), transparent 80%)`
            }}
        />
    );
};

export default CursorGlow;
