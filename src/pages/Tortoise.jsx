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

    useEffect(()=>{
        if (reachedEnd && result.length == 0) {
            setReachedEnd(false);
            setResult("THERE IS NO CYCLE!");
        }
    }, [reachedEnd])

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

    const PlayIcon = <svg width="3vw"  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M11.0748 7.50835C9.74622 6.72395 8.25 7.79065 8.25 9.21316V14.7868C8.25 16.2093 9.74622 17.276 11.0748 16.4916L15.795 13.7048C17.0683 12.953 17.0683 11.047 15.795 10.2952L11.0748 7.50835ZM9.75 9.21316C9.75 9.01468 9.84615 8.87585 9.95947 8.80498C10.0691 8.73641 10.1919 8.72898 10.3122 8.80003L15.0324 11.5869C15.165 11.6652 15.25 11.8148 15.25 12C15.25 12.1852 15.165 12.3348 15.0324 12.4131L10.3122 15.2C10.1919 15.271 10.0691 15.2636 9.95947 15.195C9.84615 15.1242 9.75 14.9853 9.75 14.7868V9.21316Z"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12Z"/>
    </svg>;
    const PlayingIcon = <svg width="3vw"  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 17.1086 6.89137 21.25 12 21.25C17.1086 21.25 21.25 17.1086 21.25 12C21.25 6.89137 17.1086 2.75 12 2.75ZM1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12ZM9.47824 7.25H9.52176C9.73604 7.24999 9.93288 7.24997 10.0982 7.26125C10.2759 7.27338 10.4712 7.30099 10.6697 7.38321C11.0985 7.56083 11.4392 7.90151 11.6168 8.3303C11.699 8.52881 11.7266 8.72415 11.7387 8.90179C11.75 9.06712 11.75 9.26396 11.75 9.47824V14.5218C11.75 14.736 11.75 14.9329 11.7387 15.0982C11.7266 15.2759 11.699 15.4712 11.6168 15.6697C11.4392 16.0985 11.0985 16.4392 10.6697 16.6168C10.4712 16.699 10.2759 16.7266 10.0982 16.7387C9.93288 16.75 9.73604 16.75 9.52176 16.75H9.47824C9.26396 16.75 9.06712 16.75 8.90179 16.7387C8.72415 16.7266 8.52881 16.699 8.3303 16.6168C7.90151 16.4392 7.56083 16.0985 7.38321 15.6697C7.30099 15.4712 7.27338 15.2759 7.26125 15.0982C7.24997 14.9329 7.24999 14.736 7.25 14.5218V9.47824C7.24999 9.26396 7.24997 9.06712 7.26125 8.90179C7.27338 8.72415 7.30099 8.52881 7.38321 8.3303C7.56083 7.9015 7.9015 7.56083 8.3303 7.38321C8.52881 7.30099 8.72415 7.27338 8.90179 7.26125C9.06712 7.24997 9.26396 7.24999 9.47824 7.25ZM8.90131 8.7703C8.84248 8.79558 8.79558 8.84248 8.7703 8.90131C8.76844 8.90866 8.76234 8.93706 8.75778 9.0039C8.75041 9.1119 8.75 9.25677 8.75 9.5V14.5C8.75 14.7432 8.75041 14.8881 8.75778 14.9961C8.76234 15.0629 8.76844 15.0913 8.7703 15.0987C8.79558 15.1575 8.84248 15.2044 8.90131 15.2297C8.90866 15.2316 8.93706 15.2377 9.0039 15.2422C9.1119 15.2496 9.25677 15.25 9.5 15.25C9.74323 15.25 9.8881 15.2496 9.9961 15.2422C10.0629 15.2377 10.0913 15.2316 10.0987 15.2297C10.1575 15.2044 10.2044 15.1575 10.2297 15.0987C10.2316 15.0913 10.2377 15.0629 10.2422 14.9961C10.2496 14.8881 10.25 14.7432 10.25 14.5V9.5C10.25 9.25677 10.2496 9.1119 10.2422 9.0039C10.2377 8.93706 10.2316 8.90866 10.2297 8.90131C10.2044 8.84247 10.1575 8.79558 10.0987 8.7703C10.0913 8.76843 10.0629 8.76233 9.9961 8.75778C9.8881 8.75041 9.74323 8.75 9.5 8.75C9.25677 8.75 9.1119 8.75041 9.0039 8.75778C8.93707 8.76234 8.90866 8.76844 8.90131 8.7703ZM14.4782 7.25H14.5218C14.736 7.24999 14.9329 7.24997 15.0982 7.26125C15.2759 7.27338 15.4712 7.30099 15.6697 7.38321C16.0985 7.56083 16.4392 7.90151 16.6168 8.3303C16.699 8.52881 16.7266 8.72415 16.7387 8.90179C16.75 9.06712 16.75 9.26396 16.75 9.47824V14.5218C16.75 14.736 16.75 14.9329 16.7387 15.0982C16.7266 15.2759 16.699 15.4712 16.6168 15.6697C16.4392 16.0985 16.0985 16.4392 15.6697 16.6168C15.4712 16.699 15.2759 16.7266 15.0982 16.7387C14.9329 16.75 14.736 16.75 14.5218 16.75H14.4782C14.264 16.75 14.0671 16.75 13.9018 16.7387C13.7241 16.7266 13.5288 16.699 13.3303 16.6168C12.9015 16.4392 12.5608 16.0985 12.3832 15.6697C12.301 15.4712 12.2734 15.2759 12.2613 15.0982C12.25 14.9329 12.25 14.736 12.25 14.5218V9.47824C12.25 9.26396 12.25 9.06712 12.2613 8.90179C12.2734 8.72415 12.301 8.52881 12.3832 8.3303C12.5608 7.90151 12.9015 7.56083 13.3303 7.38321C13.5288 7.30099 13.7241 7.27338 13.9018 7.26125C14.0671 7.24997 14.264 7.24999 14.4782 7.25ZM13.9013 8.7703C13.8425 8.79558 13.7956 8.84248 13.7703 8.90131C13.7684 8.90866 13.7623 8.93707 13.7578 9.0039C13.7504 9.1119 13.75 9.25677 13.75 9.5V14.5C13.75 14.7432 13.7504 14.8881 13.7578 14.9961C13.7623 15.0629 13.7684 15.0913 13.7703 15.0987C13.7956 15.1575 13.8425 15.2044 13.9013 15.2297C13.9087 15.2316 13.9371 15.2377 14.0039 15.2422C14.1119 15.2496 14.2568 15.25 14.5 15.25C14.7432 15.25 14.8881 15.2496 14.9961 15.2422C15.0629 15.2377 15.0913 15.2316 15.0987 15.2297C15.1575 15.2044 15.2044 15.1575 15.2297 15.0987C15.2316 15.0913 15.2377 15.0629 15.2422 14.9961C15.2496 14.8881 15.25 14.7432 15.25 14.5V9.5C15.25 9.25677 15.2496 9.1119 15.2422 9.0039C15.2377 8.93707 15.2316 8.90867 15.2297 8.90131C15.2044 8.84248 15.1575 8.79558 15.0987 8.7703C15.0913 8.76844 15.0629 8.76234 14.9961 8.75778C14.8881 8.75041 14.7432 8.75 14.5 8.75C14.2568 8.75 14.1119 8.75041 14.0039 8.75778C13.9371 8.76233 13.9087 8.76844 13.9013 8.7703Z"/>
    </svg>;

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
                    RESET
                    {/* move svg elsewhere??? */}
                <svg width="3vw" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
                    <path opacity="0.15" d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"/>
                    <path d="M15.5303 9.53033C15.8232 9.23744 15.8232 8.76256 15.5303 8.46967C15.2374 8.17678 14.7625 8.17678 14.4696 8.46967L15.5303 9.53033ZM8.46961 14.4697C8.17672 14.7626 8.17672 15.2374 8.46961 15.5303C8.76251 15.8232 9.23738 15.8232 9.53027 15.5303L8.46961 14.4697ZM9.53039 8.46967C9.2375 8.17678 8.76263 8.17678 8.46973 8.46967C8.17684 8.76256 8.17684 9.23744 8.46973 9.53033L9.53039 8.46967ZM14.4697 15.5303C14.7626 15.8232 15.2375 15.8232 15.5304 15.5303C15.8233 15.2374 15.8233 14.7626 15.5304 14.4697L14.4697 15.5303ZM14.4696 8.46967L8.46961 14.4697L9.53027 15.5303L15.5303 9.53033L14.4696 8.46967ZM8.46973 9.53033L14.4697 15.5303L15.5304 14.4697L9.53039 8.46967L8.46973 9.53033ZM20.25 12C20.25 16.5563 16.5563 20.25 12 20.25V21.75C17.3848 21.75 21.75 17.3848 21.75 12H20.25ZM12 20.25C7.44365 20.25 3.75 16.5563 3.75 12H2.25C2.25 17.3848 6.61522 21.75 12 21.75V20.25ZM3.75 12C3.75 7.44365 7.44365 3.75 12 3.75V2.25C6.61522 2.25 2.25 6.61522 2.25 12H3.75ZM12 3.75C16.5563 3.75 20.25 7.44365 20.25 12H21.75C21.75 6.61522 17.3848 2.25 12 2.25V3.75Z"/>
                </svg>
                </button>
                <br/>
                <button onClick={() => navigate(-1)} className="back-btn">
                    BACK
                    <svg width="3vw" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
                        viewBox="0 0 511.999 511.999" xmlSpace="preserve">
                    <g>
                        <g>
                            <polygon points="511.999,145.102 470.412,145.102 470.412,235.206 79.606,235.206 200.941,113.871 171.535,84.465 0,255.999 
                                171.535,427.533 200.941,398.128 79.606,276.792 511.999,276.792 		"/>
                        </g>
                    </g>
                    </svg>
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