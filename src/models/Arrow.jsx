import { useRef, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import arrow from '../assets/3d/shapes/arrow.glb';
import {a} from '@react-spring/three';


const Arrow = (props) => {
    const arrowRef = useRef();
    const { nodes, materials } = useGLTF(arrow);
    const [hovered, setHovered] = useState(0);
    const [nodeR, setNodeR] = useState(0);
    const [nodeC, setNodeC] = useState(0);
    
    const nodePosScaleFactor = 300;
    const arrowPosScaleFactor = 1.5;

    useEffect(() => {
        // Shift arrow positions when new node is created
        if (props.moveDirection == "right") {
            arrowRef.current.position.x += arrowPosScaleFactor;
        } else if (props.moveDirection == "left") {
            arrowRef.current.position.x -= arrowPosScaleFactor;
        } else if (props.moveDirection == "up") {
            arrowRef.current.position.y += arrowPosScaleFactor;
        } else if (props.moveDirection == "down") {
            arrowRef.current.position.y -= arrowPosScaleFactor;
        }
        props.setMoveDirection("");
    }, [props.moveDirection])

    const handleClick = (e) => {
        if (props.type == "right") {
            // Create node to the right
            const newPos = [props.curNodePos[0]+(nodeC+1)*nodePosScaleFactor, props.curNodePos[1], props.curNodePos[2]];            
            const newNode = props.createNode(newPos, undefined);
            props.setMoveDirection("right");
            setNodeC(nodeC+1);
            setNodeR(nodeR);
            props.addNode(newNode, nodeR, nodeC+1);
        } 
    }

    return (
            <a.group ref={arrowRef} {...props}>
                <mesh
                    geometry={nodes.Object_2.geometry}
                    material={materials.mat22}
                    rotation={[-1.126, 0.407, -0.093]}
                    onPointerEnter={() => setHovered(1)}
                    onPointerLeave={() => setHovered(0)}
                    onClick={handleClick}
                >
                    <meshPhongMaterial emissive={0x59571A} emissiveIntensity={hovered == 1 ? 4 : 0} />
                </mesh>
            </a.group>
    );
}

export default Arrow;
