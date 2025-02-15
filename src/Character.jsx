import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CapsuleCollider, useRapier } from "@react-three/rapier";
import { useEffect } from "react";
import { useRef, useMemo, useState } from "react";
import * as THREE from "three";
import { useControls } from "leva";
import useFollowCam from "./hooks/useFollowCam";



// return {forward: true,backward: false,leftward: false,rightward: false,jump: false,run: false,};

let cha;
export {cha}

function globalFunction(key) {
  key = String(key)
  if(key == "move_forward"){
    return {forward: true,backward: false,leftward: false,rightward: false,jump: false,run: false,};
  }
  else if(key=="turnLeft"){
    // console.log(false,false,true,false,false,false,); 
    return {forward: false,backward: false,leftward: true,rightward: false,jump: false,run: false,};
  }
  else if(key=="turnRight"){
    // console.log(false,false,true,false,false,false,); 
    return {forward: false,backward: false,leftward: false,rightward: true,jump: false,run: false,};
  }
  else if(key=="move_backward"){
    // console.log(false,true,false,false,false,false,);
    return {forward: false,backward: true,leftward: false,rightward: false,jump: false,run: false,};
  }
  else if(key=="jump_forward"){
    // console.log(false,true,false,false,false,false,);
    return {forward: true,backward: false,leftward: false,rightward: false,jump: true,run: false,};
  }
  else if(key=="do_nothing"){
    // console.log(false,true,false,false,false,false,);
    return {forward: false,backward: false,leftward: false,rightward: false,jump: false,run: false,};
  }
  else {
    return {forward: false,backward: false,leftward: false,rightward: false,jump: false,run: false,};
  }
  
  }




window.position = [0, 3, 0];

export function Character() {

  const characterRef = useRef();
  const characterModelRef = useRef();

  function resetCharacterPosition() { 
    const position = new THREE.Vector3();
    position.x = 0 
    position.y = 5
    position.z = 0
  characterRef.current.setTranslation(position);
  console.log(characterRef.current)

  }
  
window.resetCharacterPosition = resetCharacterPosition





const cube2bb = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());

  
  const {
    maxVelLimit,
    turnVelMultiplier,
    turnSpeed,
    sprintMult,
    jumpVel,
    sprintJumpMult,
    airDragMultiplier,
    dragDampingC,
    accDeltaTime,
    Mass,
  } = useControls("Character controls", {
    maxVelLimit: {
      value: 5,
      min: 0,
      max: 10,
      step: 0.01,
    },
    turnVelMultiplier: {
      value: 0.1,
      min: 0,
      max: 1,
      step: 0.01,
    },
    turnSpeed: {
      value: 18,
      min: 5,
      max: 30,
      step: 0.1,
    },
    sprintMult: {
      value: 1.5,
      min: 1,
      max: 3,
      step: 0.01,
    },
    jumpVel: {
      value: 4,
      min: 0,
      max: 10,
      step: 0.01,
    },
    sprintJumpMult: {
      value: 1.2,
      min: 1,
      max: 3,
      step: 0.01,
    },
    airDragMultiplier: {
      value: 0.01,
      min: 0,
      max: 1,
      step: 0.01,
    },
    dragDampingC: {
      value: 0.05,
      min: 0,
      max: 0.5,
      step: 0.01,
    },
    accDeltaTime: {
      value: 8,
      min: 0,
      max: 50,
      step: 1,
    },
    Mass: {
      value: 1,
      min: 1,
      max: 6,
      step: 1,
    },
  });



  const { rayLength, rayDir, floatingDis, springK, dampingC } = useControls(
    "Floating Ray",
    {
      rayLength: {
        value: 1.5,
        min: 0,
        max: 3,
        step: 0.01,
      },
      rayDir: { x: 0, y: -1, z: 0 },
      floatingDis: {
        value: 0.8,
        min: 0,
        max: 2,
        step: 0.01,
      },
      springK: {
        value: 3,
        min: 0,
        max: 5,
        step: 0.01,
      },
      dampingC: {
        value: 0.2,
        min: 0,
        max: 3,
        step: 0.01,
      },
    }
  );

  const {
    slopeRayOriginOffest,
    slopeRayLength,
    slopeRayDir,
    slopeUpExtraForce,
    slopeDownExtraForce,
  } = useControls("Slope Ray", {
    slopeRayOriginOffest: {
      value: 0.28,
      min: 0,
      max: 3,
      step: 0.01,
    },
    slopeRayLength: {
      value: 1.5,
      min: 0,
      max: 3,
      step: 0.01,
    },
    slopeRayDir: { x: 0, y: -1, z: 0 },
    slopeUpExtraForce: {
      value: 1.5,
      min: 0,
      max: 5,
      step: 0.01,
    },
    slopeDownExtraForce: {
      value: 4,
      min: 0,
      max: 5,
      step: 0.01,
    },
  });

  
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const { rapier, world } = useRapier();
  const rapierWorld = world.raw();

  // can jump setup
  const [canJump, setCanJump] = useState(false);

  // on moving object state
  const [isOnMovingObject, setIsOnMovingObject] = useState(false);
  const movingObjectVelocity = useMemo(() => new THREE.Vector3());
  const movingObjectVelocityInCharacterDir = useMemo(() => new THREE.Vector3());
  const distanceFromCharacterToObject = useMemo(() => new THREE.Vector3());
  const objectAngvelToLinvel = useMemo(() => new THREE.Vector3());
  const pos = [];



  
  // const turnVelMultiplier = 0.04;
  // const maxVelLimit = 5;
  // const jumpVel = 4;
  // const sprintMult = 1.5;
  // const sprintJumpMult = 1.2;
  // const dragDampingC = 0.05;
  // const airDragMultiplier = 0.03;

  
  const { pivot, followCam } = useFollowCam();
  const pivotPosition = useMemo(() => new THREE.Vector3());
  const modelEuler = useMemo(() => new THREE.Euler(), []);
  const modelQuat = useMemo(() => new THREE.Quaternion(), []);
  const moveImpulse = useMemo(() => new THREE.Vector3());
  const movingDirection = useMemo(() => new THREE.Vector3());
  const moveAccNeeded = useMemo(() => new THREE.Vector3());
  const jumpDirection = useMemo(() => new THREE.Vector3());
  const currentVel = useMemo(() => new THREE.Vector3());
  const dragForce = useMemo(() => new THREE.Vector3());
  const wantToMoveVel = useMemo(() => new THREE.Vector3());
  const getWorldPosition = useMemo(() => new THREE.Vector3());

  
  // const rayLength = 1.5;
  // const rayDir = { x: 0, y: -1, z: 0 };
  const springDirVec = useMemo(() => new THREE.Vector3());
  const characterMassForce = useMemo(() => new THREE.Vector3());
  // const floatingDis = 0.8;
  // const springK = 3;
  // const dampingC = 0.2;

  
  let slopeAngle = null;
  // const slopeRayOriginOffest = 0.28;
  const slopeRayOriginRef = useRef();
  // const slopeRayLength = 1.5;
  // const slopeUpExtraForce = 1.5;
  // const slopeDownExtraForce = 4;
  // const slopeRayDir = { x: 0, y: -1, z: 0 };
  const slopeRayorigin = useMemo(() => new THREE.Vector3());

  
  const moveCharacter = (delta, run, slopeAngle, movingObjectVelocity) => {
    
    // Only apply slope extra force when slope angle is between 0.2-1
    if (Math.abs(slopeAngle) > 0.2 && Math.abs(slopeAngle) < 1) {
      movingDirection.set(0, Math.sin(slopeAngle), Math.cos(slopeAngle));
    } else {
      movingDirection.set(0, 0, 1);
    }
    // Apply character quaternion to moving direction
    movingDirection.applyQuaternion(characterModelRef.current.quaternion);
    // Calculate moving object velocity direction according to character moving direction
    movingObjectVelocityInCharacterDir
      .copy(movingObjectVelocity)
      .projectOnVector(movingDirection)
      .multiply(movingDirection);
    // Calculate angle between moving object velocity direction and character moving direction
    const angleBetweenCharacterDirAndObjectDir =
      movingObjectVelocity.angleTo(movingDirection);

    
    // const wantToMoveMeg = currentVel.dot(movingDirection);
    // wantToMoveVel.set(
    //   movingDirection.x * wantToMoveMeg,
    //   0,
    //   movingDirection.z * wantToMoveMeg
    // );
    // const rejectVel = new THREE.Vector3().copy(currentVel).sub(wantToMoveVel);
    // console.log(wantToMoveVel);

    
    moveAccNeeded.set(
      (movingDirection.x *
        (maxVelLimit + movingObjectVelocityInCharacterDir.x) *
        (run ? sprintMult : 1) -
        (currentVel.x -
          movingObjectVelocity.x *
            Math.sin(angleBetweenCharacterDirAndObjectDir))) /
        accDeltaTime,
      0,
      (movingDirection.z *
        (maxVelLimit + movingObjectVelocityInCharacterDir.z) *
        (run ? sprintMult : 1) -
        (currentVel.z -
          movingObjectVelocity.z *
            Math.sin(angleBetweenCharacterDirAndObjectDir))) /
        accDeltaTime
    );

    // Wanted to move force function: F = ma
    const moveForceNeeded = moveAccNeeded.multiplyScalar(
      characterRef.current.mass()*Mass
    );
    // console.log(characterRef.current.translation().x)
    

    
    const characterRotated =
      Math.sin(characterModelRef.current.rotation.y).toFixed(3) ==
      Math.sin(modelEuler.y).toFixed(3);

    // If character hasn't complete turning, change the impulse quaternion follow characterModelRef quaternion
    if (!characterRotated) {
      moveImpulse.set(
        moveForceNeeded.x *
          turnVelMultiplier *
          (canJump ? 1 : airDragMultiplier), // if it's in the air, give it less control
        // -rejectVel.x * dragDampingC,
        slopeAngle === null || slopeAngle == 0 // if it's on a slope, apply extra up/down force to the body
          ? 0
          : movingDirection.y *
              turnVelMultiplier *
              (movingDirection.y > 0 // check it is on slope up or slope down
                ? slopeUpExtraForce
                : slopeDownExtraForce) *
              (run ? sprintMult : 1),
        moveForceNeeded.z *
          turnVelMultiplier *
          (canJump ? 1 : airDragMultiplier) // if it's in the air, give it less control
        // -rejectVel.z * dragDampingC
      );
    }
    // If character complete turning, change the impulse quaternion default
    else {
      moveImpulse.set(
        moveForceNeeded.x * (canJump ? 1 : airDragMultiplier),
        // -rejectVel.x * dragDampingC,
        slopeAngle === null || slopeAngle == 0 // if it's on a slope, apply extra up/down force to the body
          ? 0
          : movingDirection.y *
              (movingDirection.y > 0 // check it is on slope up or slope down
                ? slopeUpExtraForce
                : slopeDownExtraForce) *
              (run ? sprintMult : 1),
        moveForceNeeded.z * (canJump ? 1 : airDragMultiplier)
        // -rejectVel.z * dragDampingC
      );
    }

    // Move character at proper direction and impulse
    characterRef.current.applyImpulse(moveImpulse, true);
  };
  
  

  useEffect(() => {
    // Lock character rotations at any axis
    characterRef.current.lockRotations(true);

  }, []);
  useFrame((state, delta) => {
    cube2bb.setFromObject(characterModelRef.current)


    if(window.key){
      if(cube2bb.intersectsBox(cube1bb)){
        window.colorlock =true
      }
      else if(cube2bb.intersectsBox(cube3bb)){
        window.colorlock2 =true
      }
      else if(cube2bb.intersectsBox(cube4bb)){
        window.colorlock3 =true
      }
      else if(cube2bb.intersectsBox(cube5bb)){
        window.colorlock5 =true
      }
      else if(cube2bb.intersectsBox(cube7bb)){
        window.colorlock6 =true
      }
      else if(cube2bb.intersectsBox(cube8bb)){
        window.colorlock8 =true
      }
      
      else{
     
      }
          }
    else{
    
    }
    
    const dirLight = state.scene.children.find((item) => {
      return item.type === "DirectionalLight";
    });
    dirLight.position.x = characterRef.current.translation().x + 20;
    dirLight.position.y = characterRef.current.translation().y + 30;
    dirLight.position.z = characterRef.current.translation().z + 10;
    dirLight.target.position.copy(characterRef.current.translation());

    

    const { forward, backward, leftward, rightward, jump, run } = globalFunction(window.globalVariable)
    //  C3pos  = characterModelRef.current.parent.parent.children[8].position
    var C3posX  = characterModelRef.current.parent.parent.children[8].position.x.toFixed(3)
    var C3posY  = characterModelRef.current.parent.parent.children[8].position.y.toFixed(3)
    var C3posZ  = characterModelRef.current.parent.parent.children[8].position.z.toFixed(3)
    
    // while(C3posX>7){
    //   console.log("more than seven")
    // }

    if (characterRef.current.translation().x ==0 && characterRef.current.translation().z ==0 ){
      window.lock = true
      window.toi = 0
    }
    else {
      window.lock = false
      
    }
  

    // console.log(characterRef.current)



    var objpositionX = characterRef.current.translation().x
    var objpositionY = characterRef.current.translation().y
    var objpositionZ = characterRef.current.translation().z
    var objposition = [objpositionX.toFixed(1),objpositionY.toFixed(1),objpositionZ.toFixed(1)]

    

    // addPosition(pos,objposition)
    // console.log(pos)
  
    
    
    // console.log(C3posX)
    


    



    // console.log("here")
    // console.log(forward, backward, leftward, rightward, jump, run)

    // Getting moving directions

    function direction( forward, backward, leftward, rightward, jump, run ) {
      if (forward) {
        // Apply camera rotation to character model
        modelEuler.y = pivot.rotation.y;
      } else if (backward) {
        // Apply camera rotation to character model
        modelEuler.y = pivot.rotation.y + Math.PI;
      } else if (leftward) {
        // Apply camera rotation to character model
        modelEuler.y = pivot.rotation.y + Math.PI / 2;
      } else if (rightward) {
        // Apply camera rotation to character model
        modelEuler.y = pivot.rotation.y - Math.PI / 2;
      }
      if (forward && leftward) {
        // Apply camera rotation to character model
        modelEuler.y = pivot.rotation.y + Math.PI / 4;
      } else if (forward && rightward) {
        // Apply camera rotation to character model
        modelEuler.y = pivot.rotation.y - Math.PI / 4;
      } else if (backward && leftward) {
        // Apply camera rotation to character model
        modelEuler.y = pivot.rotation.y - Math.PI / 4 + Math.PI;
      } else if (backward && rightward) {
        // Apply camera rotation to character model
        modelEuler.y = pivot.rotation.y + Math.PI / 4 + Math.PI;
      }

    };
    // direction( true, false, false, false, false, false )
    // resetCharacterPosition()
    // console.log(characterRef.current.translation().x)
    // characterRef.current.translation().
    // console.log(characterRef.current.translation().x)

    direction( forward, backward, leftward, rightward, jump, run )

    // if (forward) {
    //   // Apply camera rotation to character model
    //   modelEuler.y = pivot.rotation.y;
    // } else if (backward) {
    //   // Apply camera rotation to character model
    //   modelEuler.y = pivot.rotation.y + Math.PI;
    // } else if (leftward) {
    //   // Apply camera rotation to character model
    //   modelEuler.y = pivot.rotation.y + Math.PI / 2;
    // } else if (rightward) {
    //   // Apply camera rotation to character model
    //   modelEuler.y = pivot.rotation.y - Math.PI / 2;
    // }
    // if (forward && leftward) {
    //   // Apply camera rotation to character model
    //   modelEuler.y = pivot.rotation.y + Math.PI / 4;
    // } else if (forward && rightward) {
    //   // Apply camera rotation to character model
    //   modelEuler.y = pivot.rotation.y - Math.PI / 4;
    // } else if (backward && leftward) {
    //   // Apply camera rotation to character model
    //   modelEuler.y = pivot.rotation.y - Math.PI / 4 + Math.PI;
    // } else if (backward && rightward) {
    //   // Apply camera rotation to character model
    //   modelEuler.y = pivot.rotation.y + Math.PI / 4 + Math.PI;
    // }

    // Move character to the moving direction
    if (forward || backward || leftward || rightward)
      moveCharacter(delta, run, slopeAngle, movingObjectVelocity);

    // Character current velocity
    currentVel.copy(characterRef.current.linvel());

    // Jump impulse
    if (jump && canJump) {
      // characterRef.current.applyImpulse(jumpDirection.set(0, 0.5, 0), true);
      characterRef.current.setLinvel(
        {
          x: currentVel.x,
          y: run ? sprintJumpMult * jumpVel : jumpVel,
          z: currentVel.z,
        },
        true
      );
    }

    // Rotate character model
    modelQuat.setFromEuler(modelEuler);
    characterModelRef.current.quaternion.rotateTowards(
      modelQuat,
      delta * turnSpeed
    );

    
    pivotPosition.set(
      characterRef.current.translation().x,
      characterRef.current.translation().y + 0.5,
      characterRef.current.translation().z
    );
    pivot.position.lerp(pivotPosition, 0.2);
    state.camera.lookAt(pivot.position);

    
    const origin = characterRef.current.translation();
    const rayCast = new rapier.Ray(origin, rayDir);
    const rayHit = rapierWorld.castRay(
      rayCast,
      rayLength,
      true,
      null,
      null,
      characterRef.current
    );

    if (rayHit && rayHit.toi < floatingDis + 0.1) {
      setCanJump(true);
    } else {
      setCanJump(false);
    }

    
    if (rayHit && canJump) {
      const rayHitObjectBodyType = rayHit.collider.parent().bodyType();
      // Body type 0 is rigid body, body type 1 is fixed body, body type 2 is kinematic body
      if (rayHitObjectBodyType === 0 || rayHitObjectBodyType === 2) {
        setIsOnMovingObject(true);
        // Calculate distance between character and moving object
        distanceFromCharacterToObject
          .copy(characterRef.current.translation())
          .sub(rayHit.collider.parent().translation());
        // Moving object linear velocity
        const movingObjectLinvel = rayHit.collider.parent().linvel();
        // Moving object angular velocity
        const movingObjectAngvel = rayHit.collider.parent().angvel();
        // Combine object linear velocity and angular velocity to movingObjectVelocity
        movingObjectVelocity.set(
          movingObjectLinvel.x +
            objectAngvelToLinvel.crossVectors(
              movingObjectAngvel,
              distanceFromCharacterToObject
            ).x,
          movingObjectLinvel.y,
          movingObjectLinvel.z +
            objectAngvelToLinvel.crossVectors(
              movingObjectAngvel,
              distanceFromCharacterToObject
            ).z
        );
      } else {
        setIsOnMovingObject(false);
        movingObjectVelocity.set(0, 0, 0);
      }
    }

    
    slopeRayOriginRef.current.getWorldPosition(slopeRayorigin);
    const slopeRayCast = new rapier.Ray(slopeRayorigin, slopeRayDir);
    const slopeRayHit = rapierWorld.castRay(
      slopeRayCast,
      slopeRayLength,
      true,
      null,
      null,
      characterRef.current
    );

    // Calculate slope angle
    if (slopeRayHit && rayHit && slopeRayHit.toi < floatingDis + 0.5) {
      if (canJump) {
        slopeAngle = Math.atan(
          (rayHit.toi - slopeRayHit.toi) / slopeRayOriginOffest
        ).toFixed(2);
      } else {
        slopeAngle = null;
      }
    }

    
    if (rayHit && !jump && canJump) {
      if (rayHit != null) {
        // console.log(rayHit.collider.castRayAndGetNormal(rayCast,rayLength,true).normal);
        const floatingForce =
          springK * (floatingDis - rayHit.toi) -
          characterRef.current.linvel().y * dampingC;
        characterRef.current.applyImpulse(
          springDirVec.set(0, floatingForce, 0),
        );

        // Apply opposite force to standing object
        characterMassForce.set(
          0,
          -characterRef.current.mass() * characterRef.current.gravityScale(),
          0
        );
        rayHit.collider.parent().applyImpulseAtPoint(
          characterMassForce,
          characterRef.current.translation(),
          true
        );
      }
    }
    // not on a moving object
    if (
      !forward &&
      !backward &&
      !leftward &&
      !rightward &&
      canJump &&
      !isOnMovingObject
    ) {
      dragForce.set(
        -currentVel.x * dragDampingC,
        0,
        -currentVel.z * dragDampingC
      );
      characterRef.current.applyImpulse(dragForce);
    }
    // on a moving object
    else if (
      !forward &&
      !backward &&
      !leftward &&
      !rightward &&
      canJump &&
      isOnMovingObject
    ) {
      dragForce.set(
        (movingObjectVelocity.x - currentVel.x) * dragDampingC * 2,
        0,
        (movingObjectVelocity.z - currentVel.z) * dragDampingC * 2
      );
      characterRef.current.applyImpulse(dragForce,true);
    }
  });

  return (
    <RigidBody
      colliders={false}
      position={[0,3,0]}
      friction={-0.5}
      ref={characterRef}
    >
      <CapsuleCollider args={[0.35, 0.3]} />
      <group ref={characterModelRef}>
        <mesh position={[0, 0, slopeRayOriginOffest]} ref={slopeRayOriginRef}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
        </mesh>
        <mesh castShadow>
          <capsuleGeometry args={[0.3, 0.7]} />
          <meshStandardMaterial color="black" />
        </mesh>
        <mesh castShadow position={[0, 0.2, 0.2]}>
          <boxGeometry args={[0.5, 0.2, 0.3]} />
          <meshStandardMaterial color="white" />
        </mesh>
      </group>
    </RigidBody>
  );
}
