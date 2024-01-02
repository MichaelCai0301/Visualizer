

import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useEffect} from 'react';
import { Loader } from '../components/Loader';
import Cuboctahedron from '../models/Cuboctahedron';
import Node from '../models/Node';
import Arrow from '../models/Arrow';
import AlgoNavbar from '../components/AlgoNavbar';
import { useNavigate } from 'react-router-dom';
import { randFloat } from 'three/src/math/MathUtils';
import graphComponents from '../components/graph';
import ArrowSet from '../components/ArrowSet';

const Tortoise = () => {
    var [graph, setGraph] = graphComponents;
    const [hovered, setHovered] = useState("");
    const [clicked, setClicked] = useState(false);
    var allNodes = [];
    const [curGraph, setCurGraph] = useState({graph: graph, curNode: [0, 0]});
    const[ar, setAr] = useState(0);
    const [shiftX, setShiftX] = useState(0);
    const [shiftY, setShiftY] = useState(0);
    const navigate = useNavigate();
    
    const leftArrowRotation = [0.1, -0.1, 2];
    const downArrowRotation = [0.3, 0.1, 3.5];
    const rightArrowRotation = [0, 0.47, 5.1];
    const upArrowRotation = [0.1, -0.1, 6.65];
    const arrowScale = [3,3,3];
    const startArrowRightPos = [-1.6,2.9,0];
    const startArrowDownPos = [-2.5,2.1,0];
    const startArrowLeftPos = [-3.4,3,0];
    const startArrowUpPos = [-2.5,3.9,0];
    const nodePosScaleFactor = 300;
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

    var dummynode =
           <Node
           position={[shapePosition[0]+300,shapePosition[1],shapePosition[2]]}
           scale={shapeScale}
           rotation={shapeRotation}
           hovered = {hovered}
           setHovered = {setHovered} // CHANGE TO USING REACT'S 'context' for passing hovered/sethovered?
           clicked = {clicked}
           setClicked = {setClicked}
       />;

    const addNode = (node, r, c) => {
        // console.log("!~"+ar);
        const newGraph = [...graph.map(row => [...row])];
        newGraph[r][c] = node;
        graph[r][c] = node;
        const newNode = [...curGraph.curNode];
        newNode[0] = r;
        newNode[1] = c;
        
        setCurGraph({ graph: newGraph, curNode: newNode});

        //! curNode not updating!!! 
    }
    const clickyMomo = () => {
        console.log("!~"+ar);
        setAr(prevAr=>prevAr+1);
        console.log("!~"+ar);
    }
    // useEffect(() => {
    //     alert(curGraph.curNode);
    // }, [curGraph.curNode])

    // arrPositions -- positions/statuses of each arrow for node
    const createNode = (nodePos, arrPositions) => {
        var arrows = [];
        for (let i = 0; false && i < 4; i++) {
            var pos = arrPositions[i];
            if (pos.exists) {
                console.log(pos.type);
                arrows.push(
                    <Arrow 
                        position={pos.position}
                        scale={arrowScale}
                        rotation={pos.rotation}
                        type = {pos.type}
                        hovered = {hovered} 
                        setHovered = {setHovered} // CHANGE TO USING REACT'S 'context' for passing hovered/sethovered?
                        clicked = {clicked}
                        setClicked = {setClicked}
                        curGraph = {curGraph}
                        curNodePos = {nodePos}
                        setCurGraph = {setCurGraph}
                        createNode = {createNode}
                        addNode = {addNode}
                        ar = {ar}
                        setAr = {setAr}
                    />
                );
            } 
        }
        return (
            <>
                <Node 
                    key = {100*nodePos[0]+nodePos[1]}
                    position={nodePos}
                    scale={shapeScale}
                    rotation={shapeRotation}
                    hovered = {hovered} 
                    setHovered = {setHovered} // CHANGE TO USING REACT'S 'context' for passing hovered/sethovered?
                    clicked = {clicked}
                    setClicked = {setClicked}
                    onClick = {clickyMomo}
                />
                {arrows}
            </>
        );
                
    }



    let x = shapePosition[0], y = shapePosition[1], z = shapePosition[2];
    for (let r = 0; r < 7; r++) {
        let nodeArr = [];
        x = shapePosition[0];
        for (let c = 0; c < 7; c++) {
            if (r==0&&c==0) {
                var arrPositions = [
                    {exists: true, position: startArrowRightPos, rotation: rightArrowRotation, type:'right'},
                    {exists: true, position:  startArrowDownPos, rotation: downArrowRotation, type:'down'},
                    {exists: false, position: startArrowLeftPos, rotation: leftArrowRotation, type:'left'},
                    {exists: false, position: startArrowUpPos, rotation: upArrowRotation, type:'up'}
                ]
                console.log('__'+ arrPositions[0].exists);
                nodeArr.push(
                    createNode([x,y,z], arrPositions)
                );
            } else {
                nodeArr.push(
                    undefined
                );
            }     
            x += 300;
        }
        graph.push(nodeArr);
        y -= 300;
    }
    console.log('______'+shapePosition);
    return (
        <>
            <div onClick={clickyMomo}>{ar}{curGraph.curNode}</div>
            <section className='w-full h-screen relative'>
                <Canvas className="w-full h-screen bg-transparent" camera={{near: 0.1, far:1000}}>
                    <Suspense fallback={<Loader/>}>
                        <directionalLight position={[1,1,1]} intensity={2}/>
                        <ambientLight intensity={0.5}/>
                        <hemisphereLight skyColor="#b1e1ff" groundColor="#000000" intensity={1} />
                        <ArrowSet
                            hovered = {hovered} 
                            setHovered = {setHovered} // CHANGE TO USING REACT'S 'context' for passing hovered/sethovered?
                            clicked = {clicked}
                            setClicked = {setClicked}
                            curGraph = {curGraph}
                            curNodePos = {[shapePosition[0], shapePosition[1], shapePosition[2]]}
                            setCurGraph = {setCurGraph}
                            createNode = {createNode}
                            addNode = {addNode}
                            ar = {ar}
                            setAr = {setAr}
                            shiftX = {shiftX}
                            shiftY = {shiftY}
                        />
                           {curGraph.graph}
                           
                           
                    </Suspense>
                </Canvas> 
            </section>
        </>
    )
}

export default Tortoise