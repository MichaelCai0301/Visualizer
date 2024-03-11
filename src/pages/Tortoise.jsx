import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useEffect, useRef} from 'react';
import { Loader } from '../components/Loader';
import Node from '../models/Node';
import grid from '../components/grid';
import ArrowSet from '../components/ArrowSet';
import Tube from '../models/Tube';
import Hare from '../models/Hare';
import Turtle from '../models/Turtle';
import { useNavigate } from 'react-router-dom';
import Popup from 'reactjs-popup';
import '../components/Popup.css';
import CrossIcon from '../assets/svg/x_svg';
import PlayIcon from '../assets/svg/play_svg';
import PlayingIcon from '../assets/svg/playing_svg';
import BackIcon from '../assets/svg/back_svg';

class LinkedNode {
  constructor(r,c) {
    this.next = null;
    this.r=r;
    this.c=c;
  }
  addNeighbor(neighborNode) {
    this.next = neighborNode;
  }
}


const Tortoise = () => {
    // Universal grid/linkedlist
    const [curGrid, setCurGrid] = useState(grid);
    const [turtPlay, setTurtPlay] = useState(false);
    const [hKey, setHKey] = useState(0);
    const [tKey, setTKey] = useState(-1);
    const navigate = useNavigate();
    const pageMounted = useRef(false);

    const MAXGRIDHEIGHT = 5, MAXGRIDWIDTH = 5;
    var root = new LinkedNode(0,0);
    var lnodes = [];
    // Initialize node grid
    for (let r = 0; r < MAXGRIDHEIGHT; r++) {
        let nodeArr = [];
        for (let c = 0; c < MAXGRIDWIDTH; c++) {
            nodeArr.push(
                null
            );
        }
        lnodes.push(nodeArr);
    }
    lnodes[0][0] = root;
    const [linkedNodes, setLinkedNodes] = useState(lnodes);

    const [done, setDone] = useState(false);
    const [reset, setReset] = useState(false);
    const [closeCycleTube, setCloseCycleTube] = useState(<></>);
    const [playing, setPlaying] = useState(false);

    const [turtPos, setTurtPos] = useState([0,0]);
    const [harePos, setHarePos] = useState([0,0]);
    const [result, setResult] = useState("");
    const resultCheckerMounted = useRef(false);
    const [reachedEnd, setReachedEnd] = useState(false);

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
        const newNode = new LinkedNode(r,c);
        const newNodes = [...linkedNodes.map(row=>[...row])];
        
        if (done) {
            // Prevent overriding existing node when cycle is completed
            const rotation = direction === "right" || direction === "left" ? horizTubeRotation : vertTubeRotation;
            var position = startTubeRightPos;
            if (direction === "right") position = startTubeLeftPos;
            else if (direction === "up") position = startTubeDownPos;
            else if (direction === "down") position = startTubeUpPos
            position[0] += c * horizTubeScaleFactor;
            position[1] -= r * vertTubeScaleFactor;

            // Initialize position, rotation of tube, and neighbor of last node
            var new_pos = new_posRight;
            var new_rot = new_rotHoriz;
            var new_neighbor = newNodes[r][c];
            if (direction === "left") {
                new_pos = new_posLeft;
                new_rot = new_rotHoriz;
                newNodes[r][c+1].addNeighbor(new_neighbor);
            } else if (direction === "up") {
                new_pos = new_posUp;
                new_rot = new_rotVert;
                newNodes[r+1][c].addNeighbor(new_neighbor);
            } else if (direction === "down") {
                new_pos = new_posDown;
                new_rot = new_rotVert;
                newNodes[r-1][c].addNeighbor(new_neighbor);
            } else if (direction === "right") {
                newNodes[r][c-1].addNeighbor(new_neighbor);
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
            const newGrid = [...grid.map(row => [...row])];
            newGrid[r][c] = node; // Overrides node space
            grid[r][c] = node;
            setCurGrid(newGrid);

            // Initialize node
            newNodes[r][c] = newNode;

            // Initialize prev neighbor node
            if (direction === "left") {
                newNodes[r][c+1].addNeighbor(newNodes[r][c]);
            } else if (direction === "right") {
                newNodes[r][c-1].addNeighbor(newNodes[r][c]);
            } else if (direction === "up") {
                newNodes[r+1][c].addNeighbor(newNodes[r][c]);
            } else if (direction === "down") {
                newNodes[r-1][c].addNeighbor(newNodes[r][c]);
            }
        }
        // Update set of nodes
        setLinkedNodes(newNodes);
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
    
    const resetGrid = () => {
        if (playing || turtPlay) return; // Can't reset while tortoise/hare move
        setResult("");
        setReachedEnd(false);

        // Initialize grid
        for (let r = 0; r < MAXGRIDHEIGHT; r++) {
            for (let c = 0; c < MAXGRIDWIDTH; c++) {
                if (grid[r][c]) grid[r][c] = null;
            }
        }
        grid[0][0] = createNode(shapePosition);
        setCurGrid(grid);
        setCloseCycleTube(<></>);
        lnodes = [];
        // Initialize node grid
        for (let r = 0; r < MAXGRIDHEIGHT; r++) {
            let nodeArr = [];
            for (let c = 0; c < MAXGRIDWIDTH; c++) {
                nodeArr.push(
                    null
                );
            }
            lnodes.push(nodeArr);
        }
        root = new LinkedNode(0,0);
        lnodes[0][0] = root;
        setLinkedNodes(lnodes);
        setReset(true);     
        console.log(reachedEnd, result.length);   
    }

    // Refresh grid/result whenever you page is rerendered
    useEffect(() => {
        if (!pageMounted.current) {
            pageMounted.current = true;
            resetGrid();
            setResult("");
            return;
        }
    });

    // Updated result when hare reached end of grid
    useEffect(()=>{
        if (reachedEnd && result.length == 0) {
            setReachedEnd(false);
            setResult("THERE IS NO CYCLE!");
        }
    }, [reachedEnd])

    // Begin simulation
    const play = () => {
        if (playing || turtPlay) return; // Can't play while already playing
        setResult("");
        setPlaying(true);
        setTurtPlay(true);
    }

    // Initialize grid
    for (let r = 0; r < MAXGRIDHEIGHT; r++) {
        let nodeArr = [];
        for (let c = 0; c < MAXGRIDWIDTH; c++) {
            nodeArr.push(
                null
            );
        }
        grid.push(nodeArr);
    }
    grid[0][0] = createNode(shapePosition, "", {r: 0, c: 0});

    // Update result when hare and tortoise meet
    useEffect(() => {
        if (resultCheckerMounted.current && harePos[0] == turtPos[0] && harePos[1] == turtPos[1]) {
            setResult("THERE IS A CYCLE!");

            // Reset/reposition hare/turt sprites by changing key
            setHKey(hKey+1);
            setTKey(tKey-1);

        } else if (!resultCheckerMounted.current) {
            resultCheckerMounted.current = true;
        }
    }, [harePos, turtPos]);  
        
    // Ensure tortoise and hare return to default positions once playing ends
    useEffect(() => {
        if (resultCheckerMounted.current && !playing) {
            // Reset/reposition hare/turt sprites by changing key
            setHKey(hKey+1);
            setTKey(tKey-1);
            
            setTurtPlay(false);
        } else if (!resultCheckerMounted.current) {
            resultCheckerMounted.current = true;
        }
    }, [playing])

    return (
        <>
            {/* RESULT POPUP */}
            <Popup
                open={result.length != 0}
                position="top center"
            >
                <div className='cycle-popup'>
                    {result}
                </div>
            </Popup>

            {/* NAVBAR */}
            <div className='algo-nav-background'>
                <div className='algo-header'>TORTOISE</div>
                <div className='algo-header'>& HARE</div>
                <div className='algo-subtitle'>Cycle Detection</div>
                <br/>
                <div className='algo-description'>
                    Use the arrows to 
                </div>
                <div className='algo-description'>
                     create a connected grid. 
                </div>
                <div className='algo-description'>
                    Press PLAY when ready to
                </div>
                <div className='algo-description'>
                    detect any cycles with the 
                </div>
                <div className='algo-description'>
                    algorithm.
                </div>
                <br/><br/>
                <button className={playing || turtPlay ? 'algo-btn-disabled' : 'algo-btn'} onClick={play}>
                    PLAY
                    {playing || turtPlay ? PlayingIcon : PlayIcon}
                </button>
                <br/> 
                <button className={playing || turtPlay ? 'algo-btn-disabled' : 'algo-btn'} onClick={resetGrid}>
                    RESET {CrossIcon}
                </button>
                <br/>
                <button onClick={() => navigate(-1)} className="back-btn">
                    BACK {BackIcon}
                </button>
            </div>

            {/* CANVAS */}
            <section style={{paddingLeft: "20.5%", width: "80vw", height: "100vh" }}>   
                <Canvas className="w-full h-screen bg-transparent" camera={{near: 0.1, far:1000}}>
                    <Suspense fallback={<Loader/>}>
                        <directionalLight position={[1,1,1]} intensity={2}/>
                        <ambientLight intensity={0.5}/>
                        <hemisphereLight skyColor="#b1e1ff" groundColor="#000000" intensity={1} />
                        <Hare
                            key = {hKey}
                            playing={playing}
                            setPlaying={setPlaying}
                            nodes={linkedNodes}
                            setPos = {setHarePos}
                            result = {result}
                            setReachedEnd = {setReachedEnd}
                        />
                        <Turtle
                            key = {tKey}
                            playing={turtPlay}
                            setPlaying={setTurtPlay}
                            nodes={linkedNodes}
                            setPos = {setTurtPos}
                            result = {result}
                        />
                        <ArrowSet
                            createNode = {createNode}
                            addNode = {addNode}
                            grid = {curGrid}
                            done = {done}
                            setDone = {setDone}
                            reset = {reset}
                            setReset = {setReset}
                            playing = {playing}
                            turtPlay = {turtPlay}
                            MAXGRIDHEIGHT = {MAXGRIDHEIGHT}
                            MAXGRIDWIDTH = {MAXGRIDWIDTH}
                        />
                        {curGrid}
                        {closeCycleTube}
                    </Suspense>
                </Canvas> 
            </section>
        </>
    )
}

export default Tortoise