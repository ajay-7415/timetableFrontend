import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Particles({ count = 2000 }) {
    const mesh = useRef();

    // Create particles with random positions and sizes
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const xFactor = -50 + Math.random() * 100;
            const yFactor = -50 + Math.random() * 100;
            const zFactor = -50 + Math.random() * 100;
            temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
        }
        return temp;
    }, [count]);

    useFrame((state) => {
        // Rotate the entire particle cloud slowly
        mesh.current.rotation.y += 0.001;
        mesh.current.rotation.x += 0.0005;

        particles.forEach((particle, i) => {
            let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
            t = particle.t += speed / 2;
            const a = Math.cos(t) + Math.sin(t * 1) / 10;
            const b = Math.sin(t) + Math.cos(t * 2) / 10;
            const s = Math.cos(t);

            // Update particle position based on time
            dummy.position.set(
                (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
                (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
                (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
            );

            // Pulsating size
            const scale = (s > 0 ? s : 0.5) * 1.5; // Base size
            dummy.scale.set(scale, scale, scale);

            dummy.rotation.set(s * 5, s * 5, s * 5);
            dummy.updateMatrix();

            mesh.current.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[null, null, count]}>
            <dodecahedronGeometry args={[0.2, 0]} />
            <meshPhysicalMaterial
                color="#6366f1"
                emissive="#4f46e5"
                emissiveIntensity={2}
                roughness={0.5}
                metalness={0.8}
                transparent
                opacity={0.8}
            />
        </instancedMesh>
    );
}

function Scene() {
    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#818cf8" />
            <pointLight position={[-10, -10, -10]} intensity={1.5} color="#f472b6" />
            <Particles count={300} />
        </>
    );
}

export default function ThreeBackground() {
    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, background: '#0f172a' }}>
            <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 20], fov: 60 }}>
                <Scene />
                <fog attach="fog" args={['#0f172a', 10, 40]} />
            </Canvas>
        </div>
    );
}
