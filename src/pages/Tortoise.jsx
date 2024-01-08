

import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useEffect} from 'react';
import { Loader } from '../components/Loader';
import Node from '../models/Node';
import graphComponents from '../components/graph';
import ArrowSet from '../components/ArrowSet';
import removeGif from '../assets/remove.gif';
import Tube from '../models/Tube';
const Tortoise = () => {
    // Universal graph
    const [graph, setGraph] = graphComponents;
    const [curGraph, setCurGraph] = useState(graph);
    const [done, setDone] = useState(false);
    const [reset, setReset] = useState(false);
    const [closeCycleTube, setCloseCycleTube] = useState(<></>);


    const vertTubeRotation = [0,0.5,1.6];
    const horizTubeRotation = [0,0,0];
    const tubeScale = [0.9,0.9,0.9];
    const startTubeRightPos = [-2.35,4.2,-2];
    const startTubeDownPos = [-3.5,3,-2];
    const startTubeLeftPos = [-4.65,4.2,-2];
    const startTubeUpPos = [-3.5,5.38,-2];
    const horizTubeScaleFactor = startTubeRightPos[0] - startTubeLeftPos[0];
    const vertTubeScaleFactor = startTubeUpPos[1] - startTubeDownPos[1];
    
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

    const addNode = (node, r, c, done, direction) => {
        if (done) {
            console.log("DONE");
            // Prevent overriding existing node when cycle is completed
            const rotation = direction === "right" || direction === "left" ? horizTubeRotation : vertTubeRotation;
            var position = startTubeRightPos;
            if (direction === "right") position = startTubeLeftPos;
            else if (direction === "up") position = startTubeDownPos;
            else if (direction === "down") position = startTubeUpPos
            position[0] += c * horizTubeScaleFactor;
            position[1] -= r * vertTubeScaleFactor;
            setCloseCycleTube(
                <Tube
                    position = {position}
                    rotation = {rotation}
                    appear = {true}
                    scale = {tubeScale}
                />
            );
        } else {
            const newGraph = [...graph.map(row => [...row])];
            newGraph[r][c] = node; // Overrides node space
            graph[r][c] = node;        
            setCurGraph(newGraph);
        }
    }

    const createNode = (nodePos, direction, nodeCoords) => {
        return (
            <Node 
                key = {100*nodePos[0]+nodePos[1]}
                direction = {direction}
                position={nodePos}
                nodeCoords = {nodeCoords}
                scale={shapeScale}
                rotation={shapeRotation} 
                vertTubeRotation = {vertTubeRotation}
                horizTubeRotation = {horizTubeRotation}
                tubeScale = {tubeScale}
                startTubeRightPos = {startTubeRightPos}
                startTubeDownPos = {startTubeDownPos}
                startTubeLeftPos = {startTubeLeftPos}
                startTubeUpPos = {startTubeUpPos}
                horizTubeScaleFactor = {horizTubeScaleFactor}
                vertTubeScaleFactor = {vertTubeScaleFactor}
            />
        );     
    }
    
    const resetGraph = () => {
        // Initialize graph
        for (let r = 0; r < 7; r++) {
            for (let c = 0; c < 7; c++) {
                if (graph[r][c]) graph[r][c] = null;
            }
        }
        graph[0][0] = createNode(shapePosition);
        setCurGraph(graph);
        setCloseCycleTube(<></>)
        setReset(true);        
    }

    // Initialize graph
    for (let r = 0; r < 7; r++) {
        let nodeArr = [];
        for (let c = 0; c < 7; c++) {
            nodeArr.push(
                null
            );
        }
        graph.push(nodeArr);
    }
    graph[0][0] = createNode(shapePosition, "", {r: 0, c: 0});

    return (
        <>
            <img src={removeGif} className="remove-btn" alt="loading..." onClick={resetGraph}/>
            <div className='remove-btn-txt'>RESET GRAPH</div>
            <section className='w-full h-screen relative'>
                <Canvas className="w-full h-screen bg-transparent" camera={{near: 0.1, far:1000}}>
                    <Suspense fallback={<Loader/>}>
                        <directionalLight position={[1,1,1]} intensity={2}/>
                        <ambientLight intensity={0.5}/>
                        <hemisphereLight skyColor="#b1e1ff" groundColor="#000000" intensity={1} />
                        <ArrowSet
                            createNode = {createNode}
                            addNode = {addNode}
                            graph = {curGraph}
                            done = {done}
                            setDone = {setDone}
                            reset = {reset}
                            setReset = {setReset}
                        />
                        {curGraph}
                        {closeCycleTube}
                    </Suspense>
                </Canvas> 
            </section>
        </>
    )
}

export default Tortoise