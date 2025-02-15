import { RigidBody } from "@react-three/rapier";
import { useGLTF, Text } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";

export default function Slopes() {
  // Load models
  const slopes = useGLTF("./slopes.glb");

  useEffect(() => {
    // Receive Shadows
    slopes.scene.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshStandardMaterial
      ) {
        child.receiveShadow = true;
      }
    });
  }, []);

  return (
    <group position={[-10, -1, 10]}>
      <RigidBody type="fixed" colliders="trimesh" rotation={[0, Math.PI, 0]}>
        <primitive object={slopes.scene} />
      </RigidBody>
    </group>
  );
}
