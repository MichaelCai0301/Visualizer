

import { useRef, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import {useFrame, useThree} from '@react-three/fiber';
import node from '../assets/3d/shapes/sphere.glb';
import {a} from '@react-spring/three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useNavigate } from "react-router-dom";


const Node = (props) => {
    const nodeRef = useRef();
    const { nodes, materials } = useGLTF(node);
    const [moveAway, setMoveAway] = useState(false);

    useFrame(({clock}) => {
        // if (moveAway) {
        //     if (nodeRef.current.position.y <= -100) {
        //         setMoveAway(false);
        //         // CODE TO MOVE TO OTHER PAGE
        //         console.log('---', props.typeSelected);
        //         props.navigateFunction(props.typeSelected);
        //     } else if (moveAway) {
        //         // Moving away animation
        //         nodeRef.current.position.y -= Math.min(1.9**(1.5*(clock.elapsedTime)), 10);
        //         nodeRef.current.position.x += Math.min(1.9**(3*(clock.elapsedTime)), 10);
        //     }
        // }
    });
    // Trigger moving away animation
    useEffect(() => {
        if (props.clicked) {
            setMoveAway(true);
            props.setClicked(false);
        }
    },[props.clicked])
    return (
        // <div className={props.invisible ? "invisible" : ""}>
            <a.group ref={nodeRef} {...props}>
                <mesh
                    geometry={nodes.Object_2.geometry}
                    material={materials["Scene_-_Root"]}
                    rotation={[-Math.PI / 2, 0, 0]}
                >
                    <meshPhongMaterial emissive={0x59571A} emissiveIntensity={props.hovered == 1 ? 4 : 0} />
                </mesh>
            </a.group>
        // </div>
    );
}

export default Node;
