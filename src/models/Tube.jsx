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
                <group rotation={[-Math.PI / 2, 0, Math.PI]} scale={0.708}>
                    <group rotation={[Math.PI / 2, 0, 0]}>
                    <group scale={[0.571, 0.021, 0.023]}>
                        <mesh
                        geometry={nodes.Object_4.geometry}
                        material={materials["Material.006"]}
                        visible={props.appear}
                        />
                        <mesh
                        geometry={nodes.Object_5.geometry}
                        material={materials["Material.007"]}
                        visible={false}
                        />
                    </group>
                    </group>
                </group>
            </a.group>
            
        </>
        
    );
}

export default Tube;
