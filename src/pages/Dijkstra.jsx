import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useEffect, useRef} from 'react';
import { Loader } from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import Graph from 'react-graph-vis'
import graph from '../components/graph';
import { Network } from 'vis-network';
import AddIcon from '../assets/svg/add_svg';
import CrossIcon from '../assets/svg/x_svg';
import PlayingIcon from '../assets/svg/playing_svg';
import PlayIcon from '../assets/svg/play_svg';
// docs: https://visjs.github.io/vis-network/docs/network/#methodSelection
// const events = {
//     select: function(event) {
//         var { nodes, edges } = event;
//         console.log("AAA");
//     }
// };

const options = {
    autoResize: true,
    layout: {
        hierarchical: false
    },
    edges: {
        color: "#000000",
        arrows: {
            to: {
                enabled: false
            }
        }
    },
    interaction: {
        dragNodes: true,
        dragView: true,
        zoomView: true,
    }
};



const Dijkstra = () => {
    const [dijGraph, setDijGraph] = useState(graph);
    const [nNode, setNNode] = useState(0);
    const [startNode, setStartNode] = useState(null);
    const [endNode, setEndNode] = useState(null);
    const [weight, setWeight] = useState(0);
    const [adjMatrix, setAdjMatrix] = useState([[0]]); // Adjacency matrix
    const [playing, setPlaying] = useState(false);
    const [graphOpt, setGraphOpt] = useState(options);
    const [simBegin, setSimBegin] = useState(null);
    const [simEnd, setSimEnd] = useState(null);

    const addNode = () => {
        if (playing) return;
        let curNodes = dijGraph.nodes;
        let curEdges = dijGraph.edges;
        let newNode = {id: nNode+1, label: "Node "+(nNode+1)};
        setDijGraph({nodes: [...curNodes, newNode], 
            edges: curEdges});

        // Add to adjacency matrix
        let newAdjMat = adjMatrix;
        newAdjMat[0].push(nNode+1);
        for (let i = 1; i < newAdjMat.length; i++) {
            newAdjMat[i].push(Infinity);
        }
        let newRow = [];
        for (let i = 0; i < newAdjMat[0].length; i++) newRow.push(Infinity);
        newRow[0] = nNode+1;
        newAdjMat.push(newRow);
        setAdjMatrix(newAdjMat);
        console.log(newAdjMat)

        setNNode(nNode+1);
    }
    const addEdge = () => {
        if (playing) return;
        if (startNode === null || endNode === null) return;
        if (adjMatrix[startNode][endNode] !== Infinity) {
            alert("cant have 2 edges btw same nodes!");
            setStartNode(null);
            setEndNode(null);
            return;
        }
        let curNodes = dijGraph.nodes;
        let curEdges = dijGraph.edges;
        let newEdge = { from: startNode, to: endNode, label: ""+weight};
        setDijGraph({nodes: curNodes, 
            edges: [...curEdges,newEdge]});

        // Add to adjacency matrix
        if (startNode !== endNode) {
            let newAdjMat = adjMatrix;
            newAdjMat[startNode][endNode] = weight;
            newAdjMat[endNode][startNode] = weight;
            setAdjMatrix(newAdjMat);
            console.log(newAdjMat);
        }

        setStartNode(null);
        setEndNode(null);
    }
    const resetGraph = () => {
        if (playing) return;
        setDijGraph({nodes: [], edges: []})
    }
    const handleChange = (event) => {
        if (playing) return;
        setWeight(event.target.value);
    };
    // Begin simulation
    const play = () => {
        if (playing) return; // Can't play while already playing    
        alert('select 2 nodes');
        setGraphOpt({
            // clean this up? use in terms of 'option' variable
            autoResize: true,
            layout: {
                hierarchical: false
            },
            edges: {
                color: "#000000",
                arrows: {
                    to: {
                        enabled: false
                    }
                }
            },
            interaction: {
                dragNodes: false,
                dragView: true,
                zoomView: true,
            }
        });
        setPlaying(true);
    }
    // Begin Dijkstra's algorithm
    useEffect(()=> {
        if (simBegin !== null && simEnd !== null && playing) {
            alert("PLAY");
        }
    }, [simBegin, simEnd])
    
    return (
        
        <section className='w-full h-screen relative'>
            {/* NAVBAR */}
            <div className='algo-nav-background'>
                <div className='algo-header'>DIJKSTRA'S</div>
                <div className='algo-header'>ALGORITHM</div>
                <div className='algo-subtitle'>Shortest Path Finder</div>
                <br/>
                <div className='algo-description'>
                    Click below to add a node! 
                </div>
                <button className={playing ? 'algo-btn-disabled' : 'algo-btn'} onClick={addNode}>
                    Add Node {AddIcon}
                </button>
                <div className='algo-description'>
                        Click on 2 nodes and  
                </div>
                <div className='algo-description'>
                    add an edge between them!
                </div>
                <div>Node 1: {startNode}</div>
                <div>Node 2: {endNode}</div>
                <div>Edge Weight: </div>
                <input
                    type="number"
                    value={weight}
                    onChange={handleChange}
                    placeholder="Enter a weight"
                />
                <button className={playing ? 'algo-btn-disabled': 'algo-btn'} onClick={addEdge}>
                    Add Edge {AddIcon}
                </button>
                <button className={playing ? 'algo-btn-disabled' : 'algo-btn'} onClick={resetGraph}>
                    RESET {CrossIcon}
                </button>
                <div className='algo-description'>
                    Press PLAY when ready to
                </div>
                <div className='algo-description'>
                    execute Dijkstra's algorithm.
                </div>
                <br/><br/>
                <button className={playing ? 'algo-btn-disabled' : 'algo-btn'} onClick={play}>
                    PLAY
                    {playing ? PlayingIcon : PlayIcon}
                </button>
            </div>
            <div>{playing ? "BEGINNING NODE: " + (!simBegin ? "CLICK ON A NODE TO SELECT!" : simBegin) : ""}</div>
            <div>{playing ? "ENDING NODE: " + (!simEnd ? "CLICK ON A NODE TO SELECT!" : simEnd) : ""}</div>
            <Graph 
                graph={dijGraph}
                options={graphOpt}
                events={{
                    selectNode: event => {
                    const { nodes } = event;
                    if (nodes.length > 0) {
                        const clickedNodeId = nodes[0];
                        // console.log(clickedNodeId);
                        if (playing) {
                            if (simBegin === null) {
                                setSimBegin(clickedNodeId);
                            } else if (simEnd === null) {
                                setSimEnd(clickedNodeId);
                            }
                        } else {
                            if (startNode === null) {
                                setStartNode(clickedNodeId);
                            } else if (endNode === null && startNode != clickedNodeId) {
                                setEndNode(clickedNodeId);
                            }
                        }
                    }
                    },
                }}
            />
        </section>
    )
}

export default Dijkstra