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
    const bfsVisited = new Map();

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
        newRow[newRow.length-1] = 0;
        newAdjMat.push(newRow);
        setAdjMatrix(newAdjMat);
        console.log(newAdjMat)

        // Add to graph
        let newGraphNode = new GraphNode(nNode+1);
        setGraphNodes(new Map(graphNodes.set(nNode+1, newGraphNode)));


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
    const [items, setItems] = useState([]);
    const [visited, setVisited] = useState(new Map());

    // Begin Dijkstra's algorithm
    useEffect(()=> {
        if (simBegin !== null && simEnd !== null && playing) {
            setItems([simBegin]);
            setVisited(new Map([[simBegin, true]]));
            setIterate(true);
            // handleAddItems();    
        }
        // if (simBegin !== null && simEnd !== null && playing) {
            // alert("PLAY");
            // // setBfsQ([simBegin]);
            
            // const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
            // (function loop(i) {
            //     if (i >= adjMatrix.length) {
            //         delay(1000).then(() => {
            //             // props.setPos([-1,-1]);
            //             // props.setReachedEnd(true);
            //             // props.setPlaying(false);
            //             alert('done')
            //         });
            //         return;
            //     } 
            //     delay(1000).then(() => {
            //         let cur = q[0];
            //         if (i != cur && adjMatrix[i][cur] != Infinity && !visited.has(i)) {
            //             q.push(i);
            //             console.log(q,i,adjMatrix.length);
            //             setBfsQ([...bfsQ, ...bfsQ, i]);
            //         }
            //         // loop(i+1);
            //     });
            // // })(1); // start by visiting root.next (already visited root node)
            // // while (bfsQ.length > 0) {
            // //     let cur = bfsQ[0];
            // //     for (let i = 0; i < adjMatrix.length; i++) {
            // //         if (i != cur && adjMatrix[i][cur] != Infinity && !bfsVisited.has(i)) {
            // //             bfsVisited.set(i,true);
            // //             // delay(1000).then(() => {
            // //                 setBfsQ([...bfsQ, i]);
            // //                 console.log(i);
            // //             // });
            // //         }
            // //     }
            // //     let [first, ...rest] = bfsQ;
            // //     setBfsQ(rest);
            // // }
            // // console.log(bfsQ);
            // // setBfsQ([]);
            // // set map to empty
        // }
    }, [simBegin, simEnd])


    const addItemWithDelay = (i) => {
        setItems((prevItems) => {
            let cur = prevItems[0];
            if (i != cur && adjMatrix[i][cur] != Infinity && !visited.has(i)) {
                return [...prevItems, i];
            }
            return prevItems;
        });
        setVisited((prevVisited) => new Map(prevVisited.set(i, true)));
    };
    const popItemWithDelay = () => {
        setItems((prevItems) => {
            let [first, ...rest] = prevItems;
            return rest;
        });
    };
    const handleAddItems = () => {
        while (items.length > 0) {
            console.log(graphNodes, simBegin);
            let neighbors = graphNodes.get(simBegin).neighbors;
            for (let i = 0; i < neighbors.length; i++) {
                console.log(neighbors, "AAAAA0")
                let neighbor = neighbors[i].node;
                setTimeout(() => {
                    addItemWithDelay(neighbor);
                }, i * 1000);  // i * 1000 ensures a pause between each addition
            }

        }
    };
    useEffect(() => {
        // bfs on the `items` list
        console.log('items.length > 0 && iterate', items, iterate);
        if (items.length > 0 && iterate) {
            let neighbors = graphNodes.get(items[0]).neighbors;
            for (let i = 0; i < neighbors.length; i++) {
                let neighbor = neighbors[i].node;
                setTimeout(() => {
                    addItemWithDelay(neighbor);
                }, (i+1) * 1000);  // i * 1000 ensures a pause between each addition
            }
            setTimeout(() => {
                popItemWithDelay();
            }, (neighbors.length+0.7) * 1000);
            setTimeout(() => {
                console.log("A", items);
                setIterate(false);
            }, (neighbors.length+0.8) * 1000);
            setTimeout(() => { //! maybe use delay/wait for the setIterate(false) to finish and then setIterate(true) instead of
                //! using setTimeout --> this may allow things to run more smoothly!
                console.log("B", items);
                setIterate(true);
            }, (neighbors.length+0.9) * 1000);
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