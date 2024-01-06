

import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useEffect, useContext, createContext} from 'react';
import { Loader } from '../components/Loader';
import Node from '../models/Node';
import graphComponents from '../components/graph';
import ArrowSet from '../components/ArrowSet';

export const Context = createContext();

const Tortoise = () => {
    // Universal graph
    const [graph, setGraph] = graphComponents;
    const [curGraph, setCurGraph] = useState(graph);
    const [done, setDone] = useState(false);
    var [coordStack, setCoordStack] = useState([]);
    
    const [nodeR, setNodeR] = useState(0);
    const [nodeC, setNodeC] = useState(0);
    const [nodeDir, setNodeDir] = useState("");
    const [nodeClicked, setNodeClicked] = useState(false);
    
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

    const deleteNode = (r, c) => {
        const newGraph = [...graph.map(row => [...row])];
        newGraph[r][c] = null;
        graph[r][c] = null;     
        setCurGraph(newGraph);
    }

    const createNode = (nodePos, coords, firstNode) => {
        if (!firstNode) setCoordStack([...coordStack, {r: nodeR, c: nodeC}]);
        return (
            <Node 
                key = {100*nodePos[0]+nodePos[1]}
                r={coords.r}
                c={coords.c}
                position={nodePos}
                scale={shapeScale}
                rotation={shapeRotation} 
                deleteNode={deleteNode}
                nodeR={nodeR}
                nodeC={nodeC}
                nodeDir={nodeDir}
                setNodeClicked={setNodeClicked}
                firstNode={firstNode}
            />
        );     
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
    graph[0][0] = createNode(shapePosition, {r:0,c:0}, true);

    return (
        <Context.Provider value={[coordStack, setCoordStack]}>
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
                            nodeC = {nodeC}
                            setNodeC = {setNodeC}
                            nodeR = {nodeR}
                            setNodeR = {setNodeR}
                            setNodeDir = {setNodeDir}
                            nodeClicked={nodeClicked}
                            setNodeClicked={setNodeClicked}
                            deleteNode={deleteNode}
                        />
                           {curGraph}
                    </Suspense>
                </Canvas> 
            </section>
        </Context.Provider>
    )
}

export default Tortoise