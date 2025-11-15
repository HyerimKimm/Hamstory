"use client";

import { Model } from "@/utils/hamster/Scene";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

export default function Three() {
  return (
    <Canvas
      style={{
        width: "300px",
        height: "300px",
        maxWidth: "100vw",
        maxHeight: "100vh",
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: "50%",
      }}
      camera={{
        aspect: 1,
        fov: 100,
        near: 0.1,
        far: 1000,
        position: [10, 10, 10],
      }}
    >
      <ambientLight intensity={1.2} />
      <Model scale={[20, 20, 20]} />
      <OrbitControls enableZoom={true} enableRotate={true} enablePan={true} />
    </Canvas>
  );
}
