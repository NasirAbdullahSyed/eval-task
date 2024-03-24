import { KeyboardControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import {Character} from "./Character.jsx";
import Floor from "./Floor.jsx";
import Lights from "./Lights.jsx";
import Slopes from "./Slopes.jsx";
import { useControls } from "leva";
import RotatingCube from "./RotatingCube.jsx"
import RotatingCube2 from "./RotatingCube2.jsx";
import RotatingCube3 from "./RotatingCube3.jsx";
import RotatingCube4 from "./RotatingCube4.jsx";
import RotatingCube5 from "./Rotatingcube5.jsx";
import RotatingCube6 from "./Rotatingcube6.jsx";


export default function Experience() {

  const {physics} = useControls("World Settings",{
    physics: true
  })
  const keyboardMap = [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
    { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
    { name: "rightward", keys: ["ArrowRight", "KeyD"] },
    { name: "jump", keys: ["Space"] },
    { name: "run", keys: ["Shift"] },
  ];

  return (
    <>
      
      <Lights />
      <Physics debug={physics} timeStep="vary" >
        <KeyboardControls map={keyboardMap}>
          <Character />
        </KeyboardControls>
        <RotatingCube/>
        <RotatingCube2/>
        <RotatingCube3/>
        <RotatingCube4/>
        <RotatingCube5/>
        <RotatingCube6/>
        <Floor />
        <Slopes />
      </Physics>
    </>
  );
}
