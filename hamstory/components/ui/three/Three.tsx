"use client";

// import { Model } from "@/utils/hamster/Scene";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

import { Model } from "@/utils/hamster/Scene";

export default function Three() {
  return (
    <Canvas
      style={{
        width: "700px",
        height: "700px",
        maxWidth: "100vw",
        maxHeight: "100vh",
      }}
      camera={{
        aspect: 1,
        fov: 75,
        near: 0.1,
        far: 1000,
        position: [5, 5, 5],
      }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={2} />
        <directionalLight position={[5, 5, 5]} intensity={2} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Model scale={[3, 3, 3]} />
        <OrbitControls
          enableZoom={true}
          enableRotate={true}
          enablePan={true}
          minDistance={0.1}
          maxDistance={100}
        />
      </Suspense>
    </Canvas>
  );
}
