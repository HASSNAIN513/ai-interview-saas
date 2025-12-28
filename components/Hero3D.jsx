"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial } from "@react-three/drei";
import { useRef } from "react";

function AnimatedSphere() {
    const meshRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.rotation.x = t * 0.2;
            meshRef.current.rotation.y = t * 0.3;
            meshRef.current.position.y = Math.sin(t) * 0.2;
        }
    });

    return (
        <Sphere visible args={[1, 100, 200]} scale={2.2} ref={meshRef}>
            <MeshDistortMaterial
                color="#6366F1"
                attach="material"
                distort={0.4}
                speed={1.5}
                roughness={0.2}
                metalness={0.8}
            />
        </Sphere>
    );
}

export function Hero3D() {
    return (
        <div className="h-[500px] w-full relative">
            <Canvas>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <pointLight position={[-10, -10, -5]} intensity={1} color="#FBBF24" />
                <AnimatedSphere />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
}
