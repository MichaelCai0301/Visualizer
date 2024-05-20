/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Author: PTham (https://sketchfab.com/PTham)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/tetrahedron-a016fff7c1664bc0b7457f2c99aeab98
Title: Tetrahedron
*/
import { useRef, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import {useFrame} from '@react-three/fiber';
import tetrahedron from '../assets/3d/shapes/tetrahedron.glb';
import {a} from '@react-spring/three';

const Tetrahedron = (props) => {
    const tetraRef = useRef();
    const { nodes, materials } = useGLTF(tetrahedron);
    const [moveAway, setMoveAway] = useState(false);

    useFrame(({clock}) => {
        // Rotation animation
        tetraRef.current.rotation.x += 0.005;
        tetraRef.current.rotation.y += 0.005;
        // Moving away animation
        if (moveAway) {
            if (tetraRef.current.position.y <= -300) {
                setMoveAway(false);
                // Octahedron is in charge of switching pages!
            } else if (moveAway) {
                tetraRef.current.position.y -= Math.min(1.9**(3*(clock.elapsedTime)), 10);
                tetraRef.current.position.x += Math.min(1.9**(1.5*(clock.elapsedTime)), 10);
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
        <a.group ref={tetraRef} {...props}>
            <group rotation={[-Math.PI / 2, 0, 0]}>
            <mesh
                geometry={nodes.Cylinder_0.geometry}
                material={materials.Root}
                onPointerEnter={() => props.setHovered(5)}
                onPointerLeave={() => props.setHovered(0)}
            >
                <meshPhongMaterial emissive={props.color} emissiveIntensity={props.hovered == 5 ? 4 : 0}/>
            </mesh>
            </group>
        </a.group>
    );
}

export default Tetrahedron;