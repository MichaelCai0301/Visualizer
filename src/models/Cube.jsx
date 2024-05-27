/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Author: artwork guide (https://sketchfab.com/artworkguide)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/cube-48b8725fd63a4562abc181cf09b1333a
Title: Cube
*/
import { useRef, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import {useFrame} from '@react-three/fiber';
import cube from '../assets/3d/shapes/cube.glb';
import {a} from '@react-spring/three';

const Cube = (props) => {
    const cubeRef = useRef();
    const { nodes, materials } = useGLTF(cube);
    const [moveAway, setMoveAway] = useState(false);

    useFrame(({clock}) => {
        // Rotation animation
        cubeRef.current.rotation.x += 0.005;
        cubeRef.current.rotation.y += 0.005;
        // Moving away animation
        if (moveAway) {
            if (cubeRef.current.position.y <= -300) {
                setMoveAway(false);
                // Octahedron is in charge of switching pages!
            } else if (moveAway) {
                cubeRef.current.position.y -= Math.min(1.9**(3*(clock.elapsedTime)), 10);
                cubeRef.current.position.x += Math.min(1.9**(1.5*(clock.elapsedTime)), 10);
            }
        }
    });

    useEffect(() => {
        if (props.clicked) {
            setMoveAway(true);
            props.setClicked(false);
        }
    },[props.clicked])
    
    return (
        <a.group ref={cubeRef} {...props}>
            <group rotation={[-Math.PI / 2, 0, 0]}>
            <mesh
                geometry={nodes.Object_3.geometry}
                material={materials['Scene_-_Root']}
                onPointerEnter={() => props.setHovered(4)}
                onPointerLeave={() => props.setHovered(0)}
            >
                <meshPhongMaterial emissive={props.color} emissiveIntensity={props.hovered == 4 ? 4 : 0}/>
            </mesh>
            </group>
        </a.group>
    );
}

export default Cube;
