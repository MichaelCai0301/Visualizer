import { useRef, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import tube from '../assets/3d/shapes/tube.glb';
import {a} from '@react-spring/three';

const Tube = (props) => {
    const tubeRef = useRef();
    const { nodes, materials } = useGLTF(tube);

    return (
        <>
            <a.group ref={tubeRef} {...props}>
                <group scale={0.01}>
                    <mesh
                    geometry={nodes.Plane_Material_0.geometry}
                    material={materials.Material}
                    position={props.new_pos}
                    rotation={props.new_rot}
                    scale={[200.414, 30, 100]}
                    visible={props.appear}                    
                    />
                </group>
            </a.group>
        </>
        
    );
}

export default Tube;
