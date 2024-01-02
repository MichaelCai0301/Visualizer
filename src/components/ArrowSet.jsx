

import { Canvas } from '@react-three/fiber';
import { useRef, Suspense, useState, useEffect} from 'react';
import { Loader } from '../components/Loader';
import Arrow from '../models/Arrow';
import AlgoNavbar from '../components/AlgoNavbar';
import { useNavigate } from 'react-router-dom';
import { randFloat } from 'three/src/math/MathUtils';
import graphComponents from '../components/graph';


const ArrowSet = (props) => {
    const arrowRef = useRef();
    var [graph, setGraph] = graphComponents;
    const [hovered, setHovered] = useState("");
    const [clicked, setClicked] = useState(false);
    const [moveDirection, setMoveDirection] = useState("");
    const [curGraph, setCurGraph] = useState({graph: graph, curNode: [0, 0]});
    const[ar, setAr] = useState(0);
    const navigate = useNavigate();
    
    const leftArrowRotation = [0.1, -0.1, 2];
    const downArrowRotation = [0.3, 0.1, 3.5];
    const rightArrowRotation = [0, 0.47, 5.1];
    const upArrowRotation = [0.1, -0.1, 6.65];
    const arrowScale = [3,3,3];
    const startArrowRightPos = [-1.6+props.shiftX,2.9+props.shiftY,0];
    const startArrowDownPos = [-2.5+props.shiftX,2.1+props.shiftY,0];
    const startArrowLeftPos = [-3.4+props.shiftX,3+props.shiftY,0];
    const startArrowUpPos = [-2.5+props.shiftX,3.9+props.shiftY,0];
    const nodePosScaleFactor = 300;
    const arrowPosScaleFactor = 1.5;
    const scaleToScreenSize = () => {
        let screenScale = null;
        let screenPosition = [-500, 500, -1063];
        let rotation = [0.1, 4.7, 0];
        if (window.innerWidth < 768) {
            screenScale = [100, 10, 10];
        } else {
            screenScale =  [10, 10, 10];
        }
        return [screenScale, screenPosition, rotation];
    }
    const [shapeScale, shapePosition, shapeRotation] = scaleToScreenSize();
    // arrowRef.current.position.x += arrowPosScaleFactor;
    return (
        <>
            <Arrow 
                position={startArrowDownPos}
                scale={arrowScale}
                rotation={downArrowRotation}
                type = {'down'}
                hovered = {props.hovered} 
                setHovered = {props.setHovered} // CHANGE TO USING REACT'S 'context' for passing hovered/sethovered?
                clicked = {props.clicked}
                setClicked = {props.setClicked}
                curGraph = {props.curGraph}
                curNodePos = {shapePosition}
                setCurGraph = {props.setCurGraph}
                createNode = {props.createNode}
                addNode = {props.addNode}
                ar = {props.ar}
                setAr = {props.setAr}
                moveDirection = {moveDirection}
                setMoveDirection = {setMoveDirection}
            />
            <Arrow 
                position={startArrowRightPos}
                scale={arrowScale}
                rotation={rightArrowRotation}
                type = {'right'}
                hovered = {props.hovered} 
                setHovered = {props.setHovered} // CHANGE TO USING REACT'S 'context' for passing hovered/sethovered?
                clicked = {props.clicked}
                setClicked = {props.setClicked}
                curGraph = {props.curGraph}
                curNodePos = {shapePosition}
                setCurGraph = {props.setCurGraph}
                createNode = {props.createNode}
                addNode = {props.addNode}
                ar = {props.ar}
                setAr = {props.setAr}
                moveDirection = {moveDirection}
                setMoveDirection = {setMoveDirection}
            />
            <Arrow 
                position={startArrowUpPos}
                scale={arrowScale}
                rotation={upArrowRotation}
                type = {'up'}
                hovered = {props.hovered} 
                setHovered = {props.setHovered} // CHANGE TO USING REACT'S 'context' for passing hovered/sethovered?
                clicked = {props.clicked}
                setClicked = {props.setClicked}
                curGraph = {props.curGraph}
                curNodePos = {shapePosition}
                setCurGraph = {props.setCurGraph}
                createNode = {props.createNode}
                addNode = {props.addNode}
                ar = {props.ar}
                setAr = {props.setAr}
                moveDirection = {moveDirection}
                setMoveDirection = {setMoveDirection}
            />
            <Arrow 
                position={startArrowLeftPos}
                scale={arrowScale}
                rotation={leftArrowRotation}
                type = {'left'}
                hovered = {props.hovered} 
                setHovered = {props.setHovered} // CHANGE TO USING REACT'S 'context' for passing hovered/sethovered?
                clicked = {props.clicked}
                setClicked = {props.setClicked}
                curGraph = {props.curGraph}
                curNodePos = {shapePosition}
                setCurGraph = {props.setCurGraph}
                createNode = {props.createNode}
                addNode = {props.addNode}
                ar = {props.ar}
                setAr = {props.setAr}
                moveDirection = {moveDirection}
                setMoveDirection = {setMoveDirection}
            />
        </>
    )
}

export default ArrowSet