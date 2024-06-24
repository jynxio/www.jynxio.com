"use client";

import css from "./Hero.module.css";
import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
    Float,
    Center,
    Text3D,
    Instance,
    Instances,
    Environment,
    Lightformer,
    MeshTransmissionMaterial,
    // OrbitControls,
} from "@react-three/drei";
import { EffectComposer, N8AO, TiltShift2, Glitch, Scanline } from "@react-three/postprocessing";
// import {Glitch, Scanline } from '@react-three/postprocessing';
import * as three from "three";
import { damp3 } from "maath/easing";
import { range } from "lodash-es";
// import { BlendFunction } from 'postprocessing';

function Hero() {
    return (
        <div className={css.container}>
            <Canvas shadows camera={{ position: [0, 0, 20], fov: 50 }}>
                {/* <OrbitControls /> */}
                <color attach="background" args={[0, 0, 0]} />
                <fog attach="fog" color={"#000"} near={5} far={40} />

                {/* <Grid /> */}
                {/* <Text>Jynxio</Text> */}

                <Float floatIntensity={2}>
                    <Grid />
                    <Text>Jynxio</Text>
                </Float>

                <Environment resolution={32}>
                    <group rotation={[-Math.PI / 4, -0.3, 0]}>
                        <Lightformer
                            intensity={20}
                            rotation-x={Math.PI / 2}
                            position={[0, 5, -9]}
                            scale={[10, 10, 1]}
                        />
                        <Lightformer
                            intensity={2}
                            rotation-y={Math.PI / 2}
                            position={[-5, 1, -1]}
                            scale={[10, 2, 1]}
                        />
                        <Lightformer
                            intensity={2}
                            rotation-y={Math.PI / 2}
                            position={[-5, -1, -1]}
                            scale={[10, 2, 1]}
                        />
                        <Lightformer
                            intensity={2}
                            rotation-y={-Math.PI / 2}
                            position={[10, 1, 0]}
                            scale={[20, 2, 1]}
                        />
                        <Lightformer
                            type="ring"
                            intensity={2}
                            rotation-y={Math.PI / 2}
                            position={[-0.1, -1, -5]}
                            scale={10}
                        />
                    </group>
                </Environment>

                <EffectComposer disableNormalPass>
                    {/* <Scanline blendFunction={BlendFunction.HARD_MIX} /> */}
                    {/* <Glitch strength={new three.Vector2(0.3, 1)} active={true} /> */}
                    <N8AO aoRadius={1} intensity={2} />
                    <TiltShift2 blur={0.2} />
                </EffectComposer>

                <Rig />
            </Canvas>
        </div>
    );
}

function Grid({ num = 20, thickness = 0.05, size = 0.65, color = 0xffffff }) {
    num % 2 === 0 && num++;

    const scale = 2.5;
    const start = -Math.floor(num / 2);
    const xs = range(num).map((i) => (start + i) * scale);
    const positions = xs.flatMap((x) => xs.map((z) => [x, 0, z] as [number, number, number]));

    const minDistance = 0;
    const maxDistance = Math.abs(start) * scale * 0.9;

    const instances = positions.map((item) => {
        const distance = Math.min(Math.hypot(item[0], item[2]), maxDistance);
        const percentage = 1 - (distance - minDistance) / (maxDistance - minDistance);
        const color = new three.Color().setScalar(percentage);

        return (
            <group key={String(item)} position={item}>
                <Instance rotation={[-Math.PI / 2, 0, 0]} color={color} />
                <Instance rotation={[-Math.PI / 2, 0, -Math.PI / 2]} color={color} />
            </group>
        );
    });

    return (
        <Instances>
            <planeGeometry args={[thickness, size]} />
            <meshBasicMaterial color={color} />
            {...instances}
        </Instances>
    );
}

function Rig() {
    useFrame((state, delta) => {
        damp3(
            state.camera.position,
            [
                Math.sin(-state.pointer.x) * 10,
                state.pointer.y * 3 + 14,
                Math.cos(state.pointer.x) * 10,
            ],
            0.2,
            delta,
        );
        state.camera.lookAt(0, 0, 0);
    });

    return <></>;
}

function Text({ children }: { children: string }) {
    const font = "/firacode-subset.json";

    return (
        <Center top>
            <Text3D
                castShadow
                bevelEnabled
                font={font}
                scale={5}
                letterSpacing={0}
                height={0.25}
                bevelSegments={8}
                curveSegments={8}
                bevelThickness={0}
                rotation={[-Math.PI / 2, 0, 0]}
            >
                {children}
                <MeshTransmissionMaterial
                    backside
                    backsideThickness={5}
                    thickness={2}
                    distortionScale={0.5}
                    temporalDistortion={0}
                    background={new three.Color(0x000000)}
                />
            </Text3D>
        </Center>
    );
}

export { Hero };
export default Hero;
