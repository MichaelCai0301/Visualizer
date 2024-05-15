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
// docs: https://visjs.github.io/vis-network/docs/network/#methodSelection
// const events = {
//     select: function(event) {
//         var { nodes, edges } = event;
//         console.log("AAA");
//     }
// };

class GraphNode {
    constructor(val) {
      this.neighbors = [];
      this.val = val;
    }
    // addNeighbor(neighborNode) {
    //   this.next = neighborNode;
    // }
}

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
    const [bfsQ, setBfsQ] = useState([]);
    const [graphNodes, setGraphNodes] = useState(new Map());
    const [iterate, setIterate] = useState(false);
    const [distances, setDistances] = useState(new Map());

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
    const addEdge = () => {
        if (playing) return;
        if (startNode === null || endNode === null) return;
        if (adjMatrix[startNode][endNode] !== Infinity) {
            alert("cant have 2 edges btw same nodes!" + `${startNode}, ${endNode}`);
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
    const getRoot = (str) => {
        let parenIdx = str.indexOf("(");
        if (parenIdx > -1) {
            str = str.substring(0, parenIdx);
        }
        return str;
    }
    const handleChange = (event) => {
        if (playing) return;
        setWeight(parseInt(event.target.value));
    };
    // Begin simulation
    const play = () => {
        if (playing) return; // Can't play while already playing  
        if (nNode < 2) {
            alert("Must have at least 2 nodes!")
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
    const [items, setItems] = useState([]); // items is basically the q
    const [visited, setVisited] = useState(new Map());

    // Begin Dijkstra's algorithm
    useEffect(()=> {
        if (simBegin !== null && simEnd !== null && playing) {
            setItems([simBegin]);
            highlightNode(simBegin, 0);
            setDistances(new Map([[simBegin, 0]]));
            setIterate(true);
            // handleAddItems();    
        }
    }, [simBegin, simEnd])

    // ? do i need this????
    useEffect(() => {
        if (!playing) {
            setVisited(new Map());
            setDistances(new Map());
        }
    }, [playing])


    const addItemWithDelay = (i) => {
        setItems((prevItems) => {
            let cur = prevItems[0];
            if (i != cur && adjMatrix[i][cur] != Infinity /*&& !visited.has(i)*/) {
                return [...prevItems, i];
            }
            return prevItems;
        });
        // Update the distances as per Dijkstra's algorithm
        let dist = adjMatrix[i][items[0]] + distances.get(items[0]);
        if (!distances.has(i) || dist < distances.get(i))  {
            console.log("IS", items[0], i, dist)
            setDistances((prevDistances) => new Map(prevDistances.set(i, dist)));
            console.log("vv", visited)
            console.log("dd", distances)
        }
    };
    useEffect(() => {
        console.log('ADSFDIOJDFSDS', visited)
    }, [visited])

    // popItemWithDelay () - pops first node on queue, adds that node's children to queue
    //                       renders the changes by unhighlighting popped node and highlighting
    //                       the next node.
    // Doesn't use highlightNode since 2 nodes must be highlighted at once per state update
    const map_to_s_help = (m) => {
        let s = "";
        for (let k of m.keys()) {
            s += `${k}: ${m[k]};  `
        }
        return s;
    }
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

    
    useEffect(() => {
        // bfs on the `items` list
        if (items.length > 0 && iterate) {
            let neighbors = graphNodes.get(items[0]).neighbors;
            if (!visited.has(items[0])) {
                for (let i = 0; i < neighbors.length; i++) {
                    let neighbor = neighbors[i].node;
                    console.log("NEIGH", items[0], neighbor)
                    addItemWithDelay(neighbor);
                }
            }
            setTimeout(() => {
                popItemWithDelay();
            }, (neighbors.length+0.7) * 500);
            setTimeout(() => {
                setIterate(false);
            }, (neighbors.length+0.8) * 500);
            setTimeout(() => { //! maybe use delay/wait for the setIterate(false) to finish and then setIterate(true) instead of
                //! using setTimeout --> this may allow things to run more smoothly!
                setIterate(true);
            }, (neighbors.length+0.9) * 500);
        } else if (items.length == 0 && iterate) {
            alert("DONE")
            setPlaying(false);
            setGraphOpt(options);
            setSimEnd(null);
            setSimBegin(null);
            setItems([]);
            setIterate(false);
        }
    }, [iterate]);
    // ! replace all hex color instances with global variables???
    // addLabelDistance -> you can add to the label if value is >= 0 
    //  if value is < 0 then the ([node distance]) will be removed
    // ! < -1 is if u want to use label only ; make better design
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

    const addVisualWeight = (nodeIdx, weight) => {
        var oldLabel = dijGraph.nodes[nodeIdx-1].label;
        replaceNode(nodeIdx, undefined, oldLabel + `(${weight})`);
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

    useEffect (() => {
        setDijGraph(dijGraph);
    }, [dijGraph])

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
            <div>AAAAA {bfsQ} {""+items}</div>
            
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
    )
}

export default Dijkstra