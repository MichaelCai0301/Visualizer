

import { useRef, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import node from '../assets/3d/shapes/sphere.glb';
import {a} from '@react-spring/three';


const Node = (props) => {
    const nodeRef = useRef();
    const { nodes, materials } = useGLTF(node);
    return (
        <a.group ref={nodeRef} {...props}>
            <mesh
                geometry={nodes.Object_2.geometry}
                material={materials["Scene_-_Root"]}
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <meshPhongMaterial emissive={0x59571A} emissiveIntensity={0} />
            </mesh>
        </a.group>
    );
}

export default Node;
