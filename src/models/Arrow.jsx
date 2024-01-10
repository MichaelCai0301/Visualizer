import { useRef, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import arrow from '../assets/3d/shapes/arrow.glb';
import {a} from '@react-spring/three';
import graphComponents from '../components/graph';
import {Html} from '@react-three/drei';


const Arrow = (props) => {
    const arrowRef = useRef();
    const [graph, setGraph] = graphComponents;
    const { nodes, materials } = useGLTF(arrow);
    const [hovered, setHovered] = useState(0);

    const nodePosScaleFactor = 300;
    const arrowPosScaleFactor = 1.5;

    //! IMPORTANT: Row is reversed: position-wise, nodeR should be negative, but when indexing with nodeR,
    //! use -nodeR

    useEffect(() => {
        // Shift arrow positions when new node is created
        if (props.moveDirection === "right") {
            arrowRef.current.position.x += arrowPosScaleFactor;
        } else if (props.moveDirection === "left") {
            arrowRef.current.position.x -= arrowPosScaleFactor;
        } else if (props.moveDirection === "up") {
            arrowRef.current.position.y += arrowPosScaleFactor;
        } else if (props.moveDirection === "down") {
            arrowRef.current.position.y -= arrowPosScaleFactor;
        }
        props.setMoveDirection("");
    }, [props.moveDirection])

    // Reset arrows if graph is reset
    useEffect(() => {
        arrowRef.current.position.x = props.position[0];
        arrowRef.current.position.y = props.position[1];
        props.setReset(false);
    }, [props.reset])


    const handleClick = (e) => {
        if (props.appear) {
            // console.log(props.type)
            if (props.type === "right") {
                // If moving into existing node
                if (graph[-props.nodeR][props.nodeC+1] !== null) {
                    props.setDone(true);
                }

                // Create node to the right
                const newPos = [props.curNodePos[0]+(props.nodeC+1)*nodePosScaleFactor, 
                    props.curNodePos[1]+props.nodeR*nodePosScaleFactor, props.curNodePos[2]];            
                const newNode = props.createNode(newPos, props.type, {r: -props.nodeR, c: props.nodeC+1});
                props.setMoveDirection("right");
    
                // Create node
                props.addNode(newNode, -props.nodeR, props.nodeC+1, (graph[-props.nodeR][props.nodeC+1] !== null), 
                    props.type);
    
                props.setNodeC(props.nodeC+1);
                props.setNodeR(props.nodeR);
            } else if (props.type === "down") {
                // If moving into existing node
                if (graph[-props.nodeR+1][props.nodeC] !== null) {
                    props.setDone(true);
                }
                console.log(props.moveDirection);
                // Create node to downwards direction
                const newPos = [props.curNodePos[0]+props.nodeC*nodePosScaleFactor,
                    props.curNodePos[1]+(props.nodeR-1)*nodePosScaleFactor, props.curNodePos[2]];            
                const newNode = props.createNode(newPos, props.type, {r: -(props.nodeR-1), c: props.nodeC});
                props.setMoveDirection("down");
    
                // Create node
                props.addNode(newNode, -(props.nodeR-1), props.nodeC, (graph[-props.nodeR+1][props.nodeC] !== null), 
                    props.type);
    
                props.setNodeC(props.nodeC);
                props.setNodeR(props.nodeR-1);
            } else if (props.type === "left") {
                // If moving into existing node
                if (graph[-props.nodeR][props.nodeC-1] !== null) {
                    props.setDone(true);
                }
                console.log(props.moveDirection);
                // Create node to the right
                const newPos = [props.curNodePos[0]+(props.nodeC-1)*nodePosScaleFactor, 
                    props.curNodePos[1]+props.nodeR*nodePosScaleFactor, props.curNodePos[2]];            
                const newNode = props.createNode(newPos, props.type, {r: -props.nodeR, c: props.nodeC-1});
                props.setMoveDirection("left");
    
                // Create node
                props.addNode(newNode, -props.nodeR, props.nodeC-1, (graph[-props.nodeR][props.nodeC-1] !== null), 
                    props.type);

                props.setNodeC(props.nodeC-1);
                props.setNodeR(props.nodeR);
            } else if (props.type === "up") {
                // If moving into existing node
                if (graph[-props.nodeR-1][props.nodeC] !== null) {
                    props.setDone(true);
                }
                console.log(props.moveDirection);
                // Create node to downwards direction
                const newPos = [props.curNodePos[0]+props.nodeC*nodePosScaleFactor,
                    props.curNodePos[1]+(props.nodeR+1)*nodePosScaleFactor, props.curNodePos[2]];            
                const newNode = props.createNode(newPos, props.type, {r: -(props.nodeR+1), c: props.nodeC});
                props.setMoveDirection("up");
    
                // Create node
                props.addNode(newNode, -(props.nodeR+1), props.nodeC, (graph[-props.nodeR-1][props.nodeC] !== null), 
                    props.type);
    
                props.setNodeC(props.nodeC);
                props.setNodeR(props.nodeR+1);
            }
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
                visible={props.appear}
            >
                <meshPhongMaterial emissive={hovered == 1 ?  0x0a8505: 0x949494} emissiveIntensity={hovered == 1 ? 4 : 1} color={0x969696}/>
            </mesh>
        </a.group>
    );
}

export default Arrow;
