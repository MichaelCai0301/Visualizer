import { useRef, useEffect, useState, useContext} from "react";
import { useGLTF } from "@react-three/drei";
import arrow from '../assets/3d/shapes/arrow.glb';
import {a} from '@react-spring/three';
import graphComponents from '../components/graph';
import {Html} from '@react-three/drei';
import { Context } from "../pages/Tortoise";


const Arrow = (props) => {
    const arrowRef = useRef();
    const [graph, setGraph] = graphComponents;
    const { nodes, materials } = useGLTF(arrow);
    const [hovered, setHovered] = useState(0);
    var [c, setC] = useContext(Context);

    const nodePosScaleFactor = 300;
    const arrowPosScaleFactor = 1.5;

    //! IMPORTANT: Row is reversed: position-wise, nodeR should be negative, but when indexing with nodeR,
    //! use -nodeR

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
    }, [props.moveDirection]);
    

    const handleClick = (e) => {
        if (props.appear) {
            if (props.type === "right") {
                // If moving into existing node
                if (graph[-props.nodeR][props.nodeC+1] !== null) {
                    props.setDone(true);
                }

                // Create node to the right
                const newPos = [props.curNodePos[0]+(props.nodeC+1)*nodePosScaleFactor, 
                    props.curNodePos[1]+props.nodeR*nodePosScaleFactor, props.curNodePos[2]];            
                const newNode = props.createNode(newPos, {r:props.nodeR,c:props.nodeC}, false);
                props.setMoveDirection("right");
    
                // Create node
                props.addNode(newNode, -props.nodeR, props.nodeC+1);
    
                props.setNodeC(props.nodeC+1);
                // setC(c+1);
                props.setNodeR(props.nodeR);
                // console.log("C", c);
            } else if (props.type === "down") {
                // If moving into existing node
                if (graph[-props.nodeR+1][props.nodeC] !== null) {
                    props.setDone(true);
                }
                
                // Create node to downwards direction
                const newPos = [props.curNodePos[0]+props.nodeC*nodePosScaleFactor,
                    props.curNodePos[1]+(props.nodeR-1)*nodePosScaleFactor, props.curNodePos[2]];            
                const newNode = props.createNode(newPos, {r:props.nodeR,c:props.nodeC}, false);
                props.setMoveDirection("down");
    
                // Create node
                props.addNode(newNode, -(props.nodeR-1), props.nodeC);
                props.setNodeC(props.nodeC);
                props.setNodeR(props.nodeR-1);
            } else if (props.type === "left") {
                // If moving into existing node
                if (graph[-props.nodeR][props.nodeC-1] !== null) {
                    props.setDone(true);
                }
                
                // Create node to the right
                const newPos = [props.curNodePos[0]+(props.nodeC-1)*nodePosScaleFactor, 
                    props.curNodePos[1]+props.nodeR*nodePosScaleFactor, props.curNodePos[2]];            
                const newNode = props.createNode(newPos,{r:props.nodeR,c:props.nodeC}, false);
                props.setMoveDirection("left");
    
                // Create node
                props.addNode(newNode, -props.nodeR, props.nodeC-1);
    
                props.setNodeC(props.nodeC-1);
                props.setNodeR(props.nodeR);
            } else if (props.type === "up") {
                // If moving into existing node
                if (graph[-props.nodeR-1][props.nodeC] !== null) {
                    props.setDone(true);
                }
                
                // Create node to downwards direction
                const newPos = [props.curNodePos[0]+props.nodeC*nodePosScaleFactor,
                    props.curNodePos[1]+(props.nodeR+1)*nodePosScaleFactor, props.curNodePos[2]];            
                const newNode = props.createNode(newPos,{r:props.nodeR,c:props.nodeC}, false);
                props.setMoveDirection("up");
    
                // Create node
                props.addNode(newNode, -(props.nodeR+1), props.nodeC);
    
                props.setNodeC(props.nodeC);
                props.setNodeR(props.nodeR+1);
            }
        }
    }

    useEffect(()=>{
        if (props.nodeClicked) {
            props.deleteNode(-props.nodeR, props.nodeC);
            props.setNodeClicked(false);
        }
    }, [props.nodeClicked]);

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
                <meshPhongMaterial emissive={0x59571A} emissiveIntensity={hovered == 1 ? 4 : 0} />
            </mesh>
        </a.group>
    );
}

export default Arrow;
