import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

function SpinningBox({ position, color }) {
    const meshRef = useRef();

    useFrame((state, delta) => {
        meshRef.current.rotation.x += delta;
        meshRef.current.rotation.y += delta * 0.5;
    });

    return (
        <mesh ref={meshRef} position={position}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={color} />
        </mesh>
    );
}

function Scene() {
    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <SpinningBox position={[-2, 0, 0]} color="#4f46e5" />
            <SpinningBox position={[2, 0, 0]} color="#ec4899" />
        </>
    );
}

export default function ThreeBackground() {
    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, background: '#0f172a' }}>
            <Canvas>
                <Scene />
            </Canvas>
        </div>
    );
}
