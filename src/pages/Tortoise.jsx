

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

    // Directions describe the NODES, not the tube direction
    const vertTubeRotation = [0,0.5,1.6];
    const horizTubeRotation = [0,0,0];
    const tubeScaleLeftDown = [-73,72,73];
    const tubeScaleRightUp = [73,72,73];
    const startTubeRightPos = [-300,435,-1064];
    const startTubeDownPos= [-340,-100,-1064];
    const startTubeLeftPos = [-400,485,-1064];
    const startTubeUpPos = [-400,0,-1064];
    const horizTubeScaleFactor= startTubeRightPos[0] - startTubeLeftPos[0] + 200;
    const vertTubeScaleFactor = startTubeUpPos[1] - startTubeDownPos[1] + 200;

    const new_posRight = [-300,181.849,92.489];
    const new_rotHoriz = [Math.PI, 0, 0];
    const new_rotVert = [Math.PI-0.6, 0, 0];
    const new_posLeft = [100,181.849,92.489];
    const new_posUp = [800, 181.849, 11];
    const new_posDown =[-970, 161.849, 11];
    
    const scaleToScreenSize = () => {
        let screenScale = [10, 10, 10];
        let screenPosition = [-500, 500, -1063];
        let rotation = [0.1, 4.7, 0];
        // if (window.innerWidth < 768) {
        //     screenScale = [8, 8, 8];
        // } else {
        //     screenScale =  [10, 10, 10];
        // }
        return [screenScale, screenPosition, rotation];
    }
    const [shapeScale, shapePosition, shapeRotation] = scaleToScreenSize();

    const addNode = (node, r, c, done, direction) => {
        if (done) {
            // Prevent overriding existing node when cycle is completed
            const rotation = direction === "right" || direction === "left" ? horizTubeRotation : vertTubeRotation;
            var position = startTubeRightPos;
            if (direction === "right") position = startTubeLeftPos;
            else if (direction === "up") position = startTubeDownPos;
            else if (direction === "down") position = startTubeUpPos
            position[0] += c * horizTubeScaleFactor;
            position[1] -= r * vertTubeScaleFactor;

            var new_pos = new_posRight;
            var new_rot = new_rotHoriz;
            if (direction === "left") {
                new_pos = new_posLeft;
                new_rot = new_rotHoriz;
            } else if (direction === "up") {
                new_pos = new_posUp;
                new_rot = new_rotVert;
            } else if (direction === "down") {
                new_pos = new_posDown;
                new_rot = new_rotVert;
            }

            setCloseCycleTube(
                <Tube
                    position = {position}
                    rotation = {rotation}
                    new_pos = {new_pos}
                    appear = {true}
                    scale = {(direction === "right" || direction === "up") ? tubeScaleRightUp :
                        tubeScaleLeftDown}
                    new_rot = {new_rot}
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
                tubeScaleLeftDown = {tubeScaleLeftDown}
                tubeScaleRightUp = {tubeScaleRightUp}
                startTubeRightPos = {startTubeRightPos}
                startTubeDownPos = {startTubeDownPos}
                startTubeLeftPos = {startTubeLeftPos}
                startTubeUpPos = {startTubeUpPos}
                horizTubeScaleFactor = {horizTubeScaleFactor}
                vertTubeScaleFactor = {vertTubeScaleFactor}
                new_posRight = {new_posRight}
                new_rotHoriz = {new_rotHoriz}
                new_rotVert = {new_rotVert}
                new_posLeft = {new_posLeft}
                new_posUp = {new_posUp}
                new_posDown ={new_posDown}
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