import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Graph from 'react-graph-vis'
import graph from '../../components/graph';
import AddIcon from '../../assets/svg/add_svg';
import CrossIcon from '../../assets/svg/x_svg';
import PlayingIcon from '../../assets/svg/playing_svg';
import PlayIcon from '../../assets/svg/play_svg';
import * as ENV from '../../Constants'
import BackIcon from '../../assets/svg/back_svg';
import Popup from 'reactjs-popup';
import '../../components/Popup.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// docs: https://visjs.github.io/vis-network/docs/network/#methodSelection


// Graph node of graph data structure
class GraphNode {
    constructor(val, idx) {
      this.neighbors = [];
      this.val = val;
      this.idx = idx;
    }
}

// Options for graph display
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


const Dfs = () => {
    const [dijGraph, setDijGraph] = useState(graph);                            // Main graph display
    const [nNode, setNNode] = useState(0);                                      // Node number tracker
    const [startNode, setStartNode] = useState(null);                           // For adding edges
    const [endNode, setEndNode] = useState(null);                               // For adding edges
    const [adjMatrix, setAdjMatrix] = useState([[0]]);                          // Adjacency matrix
    const [playing, setPlaying] = useState(false);                              // Playing control
    const [graphOpt, setGraphOpt] = useState(options);                          // Options for display
    const [simBegin, setSimBegin] = useState(null);                             // Starting node in simulation
    const [simEnd, setSimEnd] = useState(null);                                 // Ending node in simulation
    const [graphNodes, setGraphNodes] = useState(new Map());                    // Underlying graph datastructure
    const [running, setRunning] = useState(false);                              // For iteration/loop control
    const [nodeVal, setNodeVal] = useState(0);                                  // Value of a node
    const [toBeFound, setToBeFound] = useState(0);                              // Target node value for search
    const [result, setResult] = useState("");                                   // Final result
    const navigate = useNavigate();

    
    // Adds node to the adjacency matrix, graph display, and underlying graph data structure
    const addNode = () => {
        if (playing) return;
        let curNodes = dijGraph.nodes;
        let curEdges = dijGraph.edges;
        let newNode = {id: nNode+1, label: `${nodeVal}`, color: ENV.COLORS.GRAPH_NODE};
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
        newRow[newRow.length-1] = 0;
        newAdjMat.push(newRow);
        setAdjMatrix(newAdjMat);

        // Add to graph
        let newGraphNode = new GraphNode(nodeVal, nNode+1);
        setGraphNodes(new Map(graphNodes.set(nNode+1, newGraphNode)));

        setNNode(nNode+1);
    }

    // Adds edge to the adjacency matrix, graph display, and underlying graph data structure
    const addEdge = () => {
        if (playing) return;
        if (startNode === null || endNode === null) return;
        if (adjMatrix[startNode][endNode] !== Infinity) {
            toast("Can't have 2 edges between the same nodes!");
            setStartNode(null);
            setEndNode(null);
            return;
        }
        let curNodes = dijGraph.nodes;
        let curEdges = dijGraph.edges;
        let newEdge = { from: startNode, to: endNode};
        setDijGraph({nodes: curNodes, 
            edges: [...curEdges,newEdge]});

        // Add to adjacency matrix
        if (startNode !== endNode) {
            let newAdjMat = adjMatrix;
            newAdjMat[startNode][endNode] = 1;
            newAdjMat[endNode][startNode] = 1;
            setAdjMatrix(newAdjMat);
        }

        // Add to graph
        if (startNode !== endNode) {
            let startGNode = graphNodes.get(startNode);
            let endGNode = graphNodes.get(endNode);
            startGNode.neighbors.push(endNode);
            endGNode.neighbors.push(startNode);
            setGraphNodes(new Map(graphNodes.set(startNode, startGNode)));
            setGraphNodes(new Map(graphNodes.set(endNode, endGNode)));
        }

        setStartNode(null);
        setEndNode(null);
    }

    const resetGraph = () => {
        if (playing) return;
        setNNode(0);
        setAdjMatrix([[0]])
        setDijGraph({nodes: [], edges: []});
    }


    // HELPER: Updates node change in form
    const handleChange = (event) => {
        if (playing) return;
        setNodeVal(parseInt(event.target.value));
    };

    // HELPER: Updates target node change in form
    const changeTarget = (event) => {
        if (!playing) return;
        setToBeFound(parseInt(event.target.value));
    }

    // Begin simulation
    const play = () => {

        setSimEnd(null);
        setSimBegin(null);
        if (playing) return; // Can't play while already playing  
        
        // Enter simulation mode
        toast('Specify a node to be found!');
        setGraphOpt({
            autoResize: graphOpt.autoResize,
            layout: graphOpt.layout,
            edges: graphOpt.edges,
            interaction: {
                dragNodes: false,
                dragView: true,
                zoomView: true,
            }
        });

        setPlaying(true);
        setResult("");
    }

    const dfsMain = () => {
        setRunning(true);
        if (running) return;
        if (graphNodes.size == 0) {
            console.log("NOT FOUND");
            setResult("NOT FOUND");
            setPlaying(false);
            return;
        }
        const visited = new Set();
        let found = false; 

        async function dfsHelper(node) {
            if (visited.has(node) || found) return;
            if (toBeFound == node.val) {
                console.log("FOUND");
                setResult("FOUND");
                found = true;
                return;
            }
            visited.add(node);
            console.log(node.idx);
            highlightNode(node.idx)
    
            // Delay for 1 second (1000 ms)
            await new Promise(resolve => setTimeout(resolve, 1000));
    
            for (var neighborIdx of node.neighbors) {
                await dfsHelper(graphNodes.get(neighborIdx));
            }
        }
    
        (async () => {
            await dfsHelper(graphNodes.get(1));
            if (!found) {
                console.log("NOT FOUND", found);
                setResult("NOT FOUND");
            }
            setPlaying(false);
        })();
    }

    useEffect (() => {
        if (!playing) {
            setPlaying(false);
            setGraphOpt(options);
            setRunning(false);

            // Reset colors of nodes
            if (graphNodes.size > 0) {
                setDijGraph({nodes: dijGraph.nodes.map((n) => {
                    return {id: n.id, color: ENV.COLORS.GRAPH_NODE}
                }), edges: dijGraph.edges});
            }
        }
    }, [playing])
  

    // Helpers for highlighting ndoes
    const replaceNode = (nodeIdx, color=undefined) => {
        var nodesLeft = dijGraph.nodes.slice(0, nodeIdx-1); // this will create a copy with the same items
        var selectedNode = dijGraph.nodes[nodeIdx-1];
        nodesLeft.push({id: selectedNode.id, 
                color: color === undefined ? selectedNode.color : color});
        var nodesRight = dijGraph.nodes.slice(nodeIdx);
        setDijGraph({nodes: nodesLeft.concat(nodesRight), edges: dijGraph.edges});
    }

    const highlightNode = (nodeIdx, is_highlighted = true) => {
        if (is_highlighted) {
            replaceNode(nodeIdx, ENV.COLORS.GRAPH_NODE_HIGHLIGHTED);
            console.log(`${nodeIdx} HIGHLIGHTED`)
        } else {
            replaceNode(nodeIdx, ENV.COLORS.GRAPH_NODE);
            console.log(`${nodeIdx} UN-HIGHLIGHTED`)
        }
    } 

    return (
        <>
            {/* RESULT POPUP */}
            <Popup
                open={result.length > 0}
                position="top center"
            >
                <div className='cycle-popup'>
                    {`NODE ${toBeFound} IS ${result}!`}
                </div>
            </Popup>

            {/* SIDEBAR */}
            <section className='w-full h-screen relative'>
                <div className='nav-background'>
                    <div className='algo-header'>DEPTH </div>
                    <div className='algo-header'>FIRST </div>
                    <div className='algo-header'>SEARCH </div>
                    <div className='algo-subtitle'>Graph Traversal</div>
                    <div className='algo-subtitle'>& Searching</div>
                    <br/>
                    <hr className="rounded" />
                    {playing ? (
                        <>
                            <div className='algo-description-special-1'> The node to find: </div>
                            <form>
                            
                                <input
                                    type="number"
                                    value={toBeFound}
                                    onChange={changeTarget}
                                    style={{width: "5vw"}}
                                    placeholder={0}
                                />
                            </form>
                            <button className={running ? 'btn-disabled' : 'algo-btn'} onClick={dfsMain}>
                                FIND!
                            </button>
                        </>
                    ) : (
                        <div className='nav-background-no-animation'>
                            <div className='description'>
                                Add a node below! 
                            </div>
                            <form>
                                <label className='algo-description-special-1'>Node Value: </label>
                                <input
                                    type="number"
                                    value={nodeVal}
                                    onChange={handleChange}
                                    placeholder={0}
                                />
                            </form>
                            <button className={playing ? 'btn-disabled' : 'algo-btn'} onClick={addNode}>
                                Add Node {AddIcon}
                            </button>
                            <div className='description'>
                                    Click on 2 nodes and  
                            </div>
                            <div className='description'>
                                add an edge between them!
                            </div>
                            <div className='algo-description-special-2'>
                                <div>Node 1: {startNode ? graphNodes.get(startNode).val : "???"}</div>
                                <div>Node 2: {endNode ? graphNodes.get(endNode).val : "???"}</div>
                            </div>
                            <button className={playing ? 'btn-disabled': 'algo-btn'} onClick={addEdge}>
                                Add Edge {AddIcon}
                            </button>
                        </div>
                    )}
                    <hr className="rounded" />
                    <br/>
                    <button className={playing ? 'btn-disabled' : 'algo-btn'} onClick={resetGraph}>
                        RESET {CrossIcon}
                    </button>
                    <br/>
                    <button className={playing ? 'btn-disabled' : 'algo-btn'} onClick={play}>
                        PLAY
                        {playing ? PlayingIcon : PlayIcon}
                    </button>
                    <br/>
                    <button onClick={() => navigate(-1)} className="algo-back-btn">
                        BACK {BackIcon}
                    </button>
                </div>
                
                <Graph 
                    graph={dijGraph}
                    options={graphOpt}
                    events={{
                        selectNode: event => {
                        const { nodes } = event;
                        if (nodes.length > 0) {
                            const clickedNodeId = nodes[0];
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
            <ToastContainer />
        </>
    )
}

export default Dfs