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
import * as ENV from '../Constants'
import BackIcon from '../assets/svg/back_svg';
import Popup from 'reactjs-popup';
import '../components/Popup.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// docs: https://visjs.github.io/vis-network/docs/network/#methodSelection


// Graph node of graph data structure
class GraphNode {
    constructor(val) {
      this.neighbors = [];
      this.val = val;
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


const Dijkstra = () => {
    const [dijGraph, setDijGraph] = useState(graph);                            // Main graph display
    const [nNode, setNNode] = useState(0);                                      // Node number tracker
    const [startNode, setStartNode] = useState(null);                           // For adding edges
    const [endNode, setEndNode] = useState(null);                               // For adding edges
    const [weight, setWeight] = useState(0);                                    // For adding edges
    const [adjMatrix, setAdjMatrix] = useState([[0]]);                          // Adjacency matrix
    const [playing, setPlaying] = useState(false);                              // Playing control
    const [graphOpt, setGraphOpt] = useState(options);                          // Options for display
    const [simBegin, setSimBegin] = useState(null);                             // Starting node in simulation
    const [simEnd, setSimEnd] = useState(null);                                 // Ending node in simulation
    const [graphNodes, setGraphNodes] = useState(new Map());                    // Underlying graph datastructure
    const [iterate, setIterate] = useState(false);                              // For iteration/loop control
    const [distances, setDistances] = useState(new Map());                      // Distances for each node
    const [result, setResult] = useState({possible: false, val: Infinity})      // Final result
    const navigate = useNavigate();

    // Adds node to the adjacency matrix, graph display, and underlying graph data structure
    const addNode = () => {
        if (playing) return;
        let curNodes = dijGraph.nodes;
        let curEdges = dijGraph.edges;
        let newNode = {id: nNode+1, label: "Node "+(nNode+1), color: ENV.COLORS.GRAPH_NODE};
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
        let newGraphNode = new GraphNode(nNode+1);
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
        let newEdge = { from: startNode, to: endNode, label: `${weight}`};
        setDijGraph({nodes: curNodes, 
            edges: [...curEdges,newEdge]});

        // Add to adjacency matrix
        if (startNode !== endNode) {
            let newAdjMat = adjMatrix;
            newAdjMat[startNode][endNode] = weight;
            newAdjMat[endNode][startNode] = weight;
            setAdjMatrix(newAdjMat);
        }

        // Add to graph
        if (startNode !== endNode) {
            let startGNode = graphNodes.get(startNode);
            let endGNode = graphNodes.get(endNode);
            startGNode.neighbors.push({node: endNode, weight: weight});
            endGNode.neighbors.push({node: startNode, weight: weight});
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

    // HELPER: Gets root of a graph node label (ex. Node 2 (4) -> Node 2)
    const getRoot = (str) => {
        let parenIdx = str.indexOf("(");
        if (parenIdx > -1) {
            str = str.substring(0, parenIdx);
        }
        return str;
    }

    // HELPER: Updates weight change in form
    const handleChange = (event) => {
        if (playing) return;
        setWeight(parseInt(event.target.value));
    };

    // Begin simulation
    const play = () => {

        setSimEnd(null);
        setSimBegin(null);
        if (playing) return; // Can't play while already playing  
        if (nNode < 2) {
            toast("Graph must have at least 2 nodes!")
            return;
        }
        setVisited(new Map());
        setDistances(new Map());

        // Remove all displayed distances from previous run
        setDijGraph({nodes: dijGraph.nodes.map((n) => {
            let lab = n.label;
            let distIdx = n.label.indexOf("(");
            if (distIdx > -1)
                lab = n.label.substring(0, distIdx);
            return {id: n.id, label: lab, color: n.color}
        }), edges: dijGraph.edges});
        
        // Enter simulation mode
        toast('Select the STARTING and ENDING node!');
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
        setResult({possible: false, val: Infinity});
    }
    const [items, setItems] = useState([]);             // The BFS Queue
    const [visited, setVisited] = useState(new Map());  // Visited nodes

    // Begin Dijkstra's algorithm
    useEffect(()=> {
        if (simBegin !== null && simEnd !== null && playing) {
            setItems([simBegin]);
            highlightNode(simBegin, 0);
            setDistances(new Map([[simBegin, 0]]));
            setIterate(true);
        }
    }, [simBegin, simEnd])

    // Add to BFS queue with delay for animation
    const addItemWithDelay = (i) => {
        setItems((prevItems) => {
            let cur = prevItems[0];
            if (i != cur && adjMatrix[i][cur] != Infinity) {
                return [...prevItems, i];
            }
            return prevItems;
        });
        // Update the distances as per Dijkstra's algorithm
        let dist = adjMatrix[i][items[0]] + distances.get(items[0]);
        if (!distances.has(i) || dist < distances.get(i))  {
            setDistances((prevDistances) => new Map(prevDistances.set(i, dist)));
        }
    };
    
    //  pops first node on BFS queue, adds that node's children to queue
    //  renders the changes by unhighlighting popped node and highlighting
    //  the next node.
    // Doesn't use highlightNode since 2 nodes must be highlighted at once per state update
    const popItemWithDelay = () => {
        setItems((prevItems) => {
            let [first, ...rest] = prevItems;
            // First, pop old node (idx at `first`)
            var nodesLeft = dijGraph.nodes.slice(0, first-1); // this will create a copy with the same items
            var selectedNode = dijGraph.nodes[first-1];
            nodesLeft.push({id: selectedNode.id, 
                    label: selectedNode.label,
                    color: ENV.COLORS.GRAPH_NODE});
            var nodesRight = dijGraph.nodes.slice(first);
            var poppedGraph = {nodes: nodesLeft.concat(nodesRight), edges: dijGraph.edges};
            var mutatedGraph = poppedGraph;
            setVisited(visited.set(first, true));

            // Then, push new node (idx at `rest[0]`)
            if (rest.length > 0) {
                nodesLeft = poppedGraph.nodes.slice(0, rest[0]-1);
                selectedNode = poppedGraph.nodes[rest[0]-1];
                nodesLeft.push({id: selectedNode.id, 
                    label: getRoot(selectedNode.label) + `(${distances.get(selectedNode.id)})`,
                    color: ENV.COLORS.GRAPH_NODE_HIGHLIGHTED});
                nodesRight = poppedGraph.nodes.slice(rest[0]);
                mutatedGraph = {nodes: nodesLeft.concat(nodesRight), edges: dijGraph.edges};
            }
            setDijGraph(mutatedGraph);
            console.log(mutatedGraph);
            return rest;
        });
    };

    // Perform BFS
    useEffect(() => {
        if (items.length > 0 && iterate) {
            let neighbors = graphNodes.get(items[0]).neighbors;
            if (!visited.has(items[0])) {
                for (let i = 0; i < neighbors.length; i++) {
                    let neighbor = neighbors[i].node;
                    addItemWithDelay(neighbor);
                }
            }
            setTimeout(() => {
                popItemWithDelay();
            }, (neighbors.length+0.7) * 500);
            setTimeout(() => {
                setIterate(false);
            }, (neighbors.length+0.8) * 500);
            setTimeout(() => { 
                setIterate(true);
            }, (neighbors.length+0.9) * 500);
        } else if (items.length == 0 && iterate) {
            setPlaying(false);
            let pathExists = distances.has(simEnd)
            setResult({possible: pathExists, val: pathExists ? distances.get(simEnd) : 0});
            setGraphOpt(options);
            setItems([]);
            setIterate(false);
        }
    }, [iterate]);

    // Helpers for highlighting ndoes
    const replaceNode = (nodeIdx, color=undefined, label=undefined, weight = -1) => {
        var nodesLeft = dijGraph.nodes.slice(0, nodeIdx-1); // this will create a copy with the same items
        var selectedNode = dijGraph.nodes[nodeIdx-1];
        label = weight >= 0 ? getRoot(selectedNode.label) + `(${weight})` : weight == -1
            selectedNode.label.substring(0, selectedNode.label.indexOf("(")) 
        nodesLeft.push({id: selectedNode.id, 
                label: label === undefined ? selectedNode.label : label,
                color: color === undefined ? selectedNode.color : color});
        var nodesRight = dijGraph.nodes.slice(nodeIdx);
        setDijGraph({nodes: nodesLeft.concat(nodesRight), edges: dijGraph.edges});
    }

    const highlightNode = (nodeIdx, weight = -1, is_highlighted = true) => {
        if (is_highlighted) {
            replaceNode(simBegin, ENV.COLORS.GRAPH_NODE_HIGHLIGHTED, undefined, weight);
            console.log(`${nodeIdx} HIGHLIGHTED`)
        } else {
            replaceNode(nodeIdx, -1, ENV.COLORS.GRAPH_NODE);
            console.log(`${nodeIdx} UN-HIGHLIGHTED`)
        }
    } 

    return (
        <>
            {/* RESULT POPUP */}
            <Popup
                open={result.val !== Infinity && result.possible}
                position="top center"
            >
                <div className='cycle-popup'>
                    {`The shortest distance between Node ${simBegin} and 
                    Node ${simEnd} is ${result.val}!`}
                </div>
            </Popup>
            <Popup
                open={result.val !== Infinity && !result.possible}
                position="top center"
            >
                <div className='cycle-popup'>
                    {`Unable to find a path between Node ${simBegin} and 
                    Node ${simEnd}!`}
                </div>
            </Popup>

            {/* SIDEBAR */}
            <section className='w-full h-screen relative'>
                <div className='nav-background'>
                    <div className='algo-header'>DIJKSTRA'S</div>
                    <div className='algo-header'>ALGORITHM</div>
                    <div className='algo-subtitle'>Shortest Path Finder</div>
                    <br/>
                    <hr className="rounded" />
                    {playing ? (
                        <div className='nav-background-no-animation'>
                            <div className='description'>
                                Click on a node to specify 
                            </div>
                            <div className='description'>
                                start/end nodes!
                            </div>
                            <div className='algo-description-special-2'>
                                {"START NODE: " + (!simBegin ? "???" : simBegin)}
                            </div>
                            <div className='algo-description-special-2'>
                                {"END NODE: " + (!simEnd ? "???" : simEnd)}
                            </div>
                        </div>
                    ) : (
                        <div className='nav-background-no-animation'>
                            <div className='description'>
                                Click below to add a node! 
                            </div>

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
                                <div>Node 1: {startNode ? startNode : "???"}</div>
                                <div>Node 2: {endNode ? endNode : "???"}</div>
                            </div>
                            <form>
                                <label className='algo-description-special-1'>Edge Weight: </label>
                                <input
                                    type="number"
                                    value={weight}
                                    onChange={handleChange}
                                    placeholder={0}
                                />
                            </form>
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

export default Dijkstra