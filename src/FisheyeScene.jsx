import { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';
import { Gltf, Environment, KeyboardControls } from '@react-three/drei';
import Controller, { EcctrlJoystick } from 'ecctrl';

export default function FisheyeScene() {
  const [joystick, setJoystick] = useState({ x: 0, y: 0 });  // Menyimpan posisi joystick
  const characterRef = useRef();  // Ref untuk karakter yang akan digerakkan

  const keyboardMap = [
    { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
    { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
    { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
    { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
    { name: 'jump', keys: ['Space'] },
    { name: 'run', keys: ['Shift'] },
  ];

  const handlePointerLock = (e) => {
    e.target.requestPointerLock();
  };

  // Fungsi untuk menangani pergerakan karakter
  const handleJoystickMove = ({ x, y }) => {
    // Cek jika nilai x atau y adalah NaN, dan set ke 0 jika demikian
    if (isNaN(x) || isNaN(y)) {
      console.warn("Joystick input is NaN, setting to 0");
      x = 0;
      y = 0;
    }

    // Mengupdate posisi joystick
    setJoystick({ x, y });

    // Pergerakan karakter berdasarkan input joystick
    if (characterRef.current) {
      const speed = 0.1;  // Kecepatan karakter
      characterRef.current.position.x += x * speed;
      characterRef.current.position.z -= y * speed;  // Negatif karena sumbu Y di screen kebalikan
    }
  };

  return (
    <>
      {/* Joystick untuk Mode Mobile */}
      <EcctrlJoystick
        containerClass="joystick-container"
        joystickClass="joystick"
        dynamicPosition={true}
        maxRange={50}
        opacity={0.7}
        radius={50}
        position="absolute"
        bottom={30}
        left={30}
        onMove={handleJoystickMove}  // Menangkap input gerakan joystick
      />
      
      <Canvas shadows onPointerDown={handlePointerLock}>
        <Environment files="/models/night.hdr" ground={{ scale: 100 }} />
        <directionalLight intensity={0.7} castShadow shadow-bias={-0.0004} position={[-20, 20, 20]}>
          <orthographicCamera attach="shadow-camera" args={[-20, 20, 20, -20]} />
        </directionalLight>
        <ambientLight intensity={0.2} />

        {/* Physics and Scene */}
        <Physics timeStep="vary">
          <KeyboardControls map={keyboardMap}>
            <Controller maxVelLimit={5}>
              <Gltf
                ref={characterRef}  // Menghubungkan ref ke model karakter
                castShadow
                receiveShadow
                scale={0.315}
                position={[0, -0.55, 0]}
                src="/models/ghost_w_tophat-transformed.glb"
              />
            </Controller>
          </KeyboardControls>

          <RigidBody type="fixed" colliders="trimesh">
            <Gltf 
              castShadow 
              receiveShadow 
              scale={1} 
              src="/models/lowpoly_city (3).glb" 
            />
          </RigidBody>
        </Physics>
      </Canvas>
    </>
  );
}