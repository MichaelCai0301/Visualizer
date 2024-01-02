

import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useEffect} from 'react';
import { Loader } from '../components/Loader';
import Node from '../models/Node';
import graphComponents from '../components/graph';
import ArrowSet from '../components/ArrowSet';

const Tortoise = () => {
    // Universal graph
    const [graph, setGraph] = graphComponents;
    const [curGraph, setCurGraph] = useState(graph);
    
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

    // Initialize graph
    for (let r = 0; r < 7; r++) {
        let nodeArr = [];
        for (let c = 0; c < 7; c++) {
            nodeArr.push(
                undefined
            );
        }
        graph.push(nodeArr);
    }
    graph[0][0] = createNode(shapePosition, undefined);

    return (
        <>
            <section className='w-full h-screen relative'>
                <Canvas className="w-full h-screen bg-transparent" camera={{near: 0.1, far:1000}}>
                    <Suspense fallback={<Loader/>}>
                        <directionalLight position={[1,1,1]} intensity={2}/>
                        <ambientLight intensity={0.5}/>
                        <hemisphereLight skyColor="#b1e1ff" groundColor="#000000" intensity={1} />
                        <ArrowSet
                            createNode = {createNode}
                            addNode = {addNode}
                        />
                           {curGraph}
                    </Suspense>
                </Canvas> 
            </section>
        </>
    )
}

export default Tortoise