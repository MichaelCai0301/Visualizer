

import { useRef, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import {useFrame, useThree} from '@react-three/fiber';
import arrow from '../assets/3d/shapes/arrow.glb';
import {a} from '@react-spring/three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useNavigate } from "react-router-dom";


const Arrow = (props) => {
    const arrowRef = useRef();
    const { nodes, materials } = useGLTF(arrow);
    const [moveAway, setMoveAway] = useState(false);
    const [hovered, setHovered] = useState(0);
    const [nodeR, setNodeR] = useState(props.curGraph.curNode[0]);
    const [nodeC, setNodeC] = useState(props.curGraph.curNode[1]);
    
    const leftArrowRotation = [0.1, -0.1, 2];
    const downArrowRotation = [0.3, 0.1, 3.5];
    const rightArrowRotation = [0, 0.47, 5.1];
    const upArrowRotation = [0.1, -0.1, 6.65];
    const arrowScale = [3,3,3];
    // const startArrowRightPos = [-1.6,2.9,0];
    // const startArrowDownPos = [-2.5,2.1,0];
    // const startArrowLeftPos = [-3.4,3,0];
    // const startArrowUpPos = [-2.5,3.9,0];
    const nodePosScaleFactor = 300;
    const arrowPosScaleFactor = 1.5;

    useEffect(() => {
        if (props.moveDirection != "") {
            arrowRef.current.position.x += arrowPosScaleFactor;
        }
        props.setMoveDirection("");
    }, [props.moveDirection])

    const handleClick = (e) => {
        if (props.type == "right") {
            // console.log("!!!!!!"+props.ar);
            // props.setAr(props.ar+1);
            // console.log("!!!!!!"+props.ar);
            console.log("!_!+"+props.curNodePos);
            console.log("!)(!"+nodeR+","+nodeC);
            const newPos = [props.curNodePos[0]+(nodeC+1)*nodePosScaleFactor, props.curNodePos[1], props.curNodePos[2]];
            // var [r, c] = props.curGraph.curNode;
            var [r, c] = [nodeR, nodeC];
            // var arrPositions = [
            //     {exists: c < 6 && props.curGraph.graph[r][c+1] === undefined, 
            //         position: [startArrowRightPos[0]+arrowPosScaleFactor*(c+1), startArrowRightPos[1]+arrowPosScaleFactor*r, startArrowRightPos[2]], 
            //         rotation: rightArrowRotation, type:'right'},
            //     {exists: r < 6 && props.curGraph.graph[r+1][c] === undefined,
            //         position:  [startArrowDownPos[0]+arrowPosScaleFactor*(c+1), startArrowDownPos[1]+arrowPosScaleFactor*r, startArrowDownPos[2]],
            //         rotation: downArrowRotation, type:'down'},
            //     {exists: c > 0 && props.curGraph.graph[r][c-1] === undefined,
            //          position: [startArrowLeftPos[0]+arrowPosScaleFactor*(c+1), startArrowLeftPos[1]+arrowPosScaleFactor*r, startArrowLeftPos[2]],
            //          rotation: leftArrowRotation, type:'left'},
            //     {exists: r > 0 && props.curGraph.graph[r-1][c] === undefined,
            //         position:  [startArrowUpPos[0]+arrowPosScaleFactor*(c+1), startArrowUpPos[1]+arrowPosScaleFactor*r, startArrowUpPos[2]],
            //         rotation: upArrowRotation, type:'up'}
            // ]
            // alert(arrPositions)
            // console.log(arrPositions[0].exists, arrPositions[1].exists, arrPositions[2].exists, arrPositions[3].exists);
            const newNode = props.createNode(newPos, undefined);
            // arrowRef.current.position.x += arrowPosScaleFactor;
            props.setMoveDirection("right");
            setNodeC(nodeC+1);
            setNodeR(nodeR);
            console.log("!)(!"+nodeR+","+nodeC);
            props.addNode(newNode, r, c+1);
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
