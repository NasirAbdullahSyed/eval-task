import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience.jsx";
import { Leva } from "leva";
const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
  <>
  <Leva collapsed position={{x:10,y:10}}/>
  <Canvas
    shadows
    camera={{
      fov: 65,
      near: 0.1,
      far: 1000,
      position: [0, 0, -1],
    }}
    onPointerDown={(e) => {
      e.target.requestPointerLock();
    }}
  >
    <Experience />
  </Canvas>
  </>
);
