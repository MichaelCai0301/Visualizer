import { useRef, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import tube from '../assets/3d/shapes/tube.glb';
import {a} from '@react-spring/three';

const Tube2 = (props) => {
    const tubeRef = useRef();
    const { nodes, materials } = useGLTF(tube);
    return (
        <>
            <a.group ref={tubeRef} {...props}>
                <group scale={0.01}>
                    <mesh
                    geometry={nodes.Plane_Material_0.geometry}
                    material={materials.Material}
                    position={[104.446, 181.849, 92.489]}
                    rotation={[Math.PI, 0, 0]}
                    scale={[487.414, 100, 100]}
                    visible={props.appear}
                    />
                </group>
            </a.group>
            
        </>
        
    );
}

export default Tube2;
