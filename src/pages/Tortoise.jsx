

import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useEffect} from 'react';
import { Loader } from '../components/Loader';
import Node from '../models/Node';
import graphComponents from '../components/graph';
import ArrowSet from '../components/ArrowSet';
import removeGif from '../assets/remove.gif';

const Tortoise = () => {
    // Universal graph
    const [graph, setGraph] = graphComponents;
    const [curGraph, setCurGraph] = useState(graph);
    const [done, setDone] = useState(false);
    const [reset, setReset] = useState(false);
    
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

    const addNode = (node, r, c) => {
        console.log('|'+r, c);
        const newGraph = [...graph.map(row => [...row])];
        newGraph[r][c] = node;
        graph[r][c] = node;        
        setCurGraph(newGraph);
    }

    const createNode = (nodePos) => {
        return (
            <Node 
                key = {100*nodePos[0]+nodePos[1]}
                position={nodePos}
                scale={shapeScale}
                rotation={shapeRotation} // CHANGE TO USING REACT'S 'context' for passing hovered/sethovered?
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
    graph[0][0] = createNode(shapePosition);

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
                    </Suspense>
                </Canvas> 
            </section>
        </>
    )
}

export default Tortoise