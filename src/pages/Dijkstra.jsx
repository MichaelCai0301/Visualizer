import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useEffect, useRef} from 'react';
import { Loader } from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import Graph from 'react-graph-vis'
import graph from '../components/graph';
import { Network } from 'vis-network';
import AddIcon from '../assets/svg/add_svg';
import CrossIcon from '../assets/svg/x_svg';
// docs: https://visjs.github.io/vis-network/docs/network/#methodSelection
// const events = {
//     select: function(event) {
//         var { nodes, edges } = event;
//         console.log("AAA");
//     }
// };
const options = {
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
};



const Dijkstra = () => {
    const [dijGraph, setDijGraph] = useState(graph);
    const [nNode, setNNode] = useState(5);
    const [startNode, setStartNode] = useState(null);
    const [endNode, setEndNode] = useState(null);
    const [weight, setWeight] = useState(0);
    const addNode = () => {
        let curNodes = dijGraph.nodes;
        let curEdges = dijGraph.edges;
        let newNode = {id: nNode+1, label: "Node "+(nNode+1)};
        setDijGraph({nodes: [...curNodes, newNode], 
            edges: curEdges});
        setNNode(nNode+1);
    }
    const addEdge = () => {
        if (startNode === null || endNode === null) return;
        let curNodes = dijGraph.nodes;
        let curEdges = dijGraph.edges;
        let newEdge = { from: startNode, to: endNode, label: ""+weight};
        setDijGraph({nodes: curNodes, 
            edges: [...curEdges,newEdge]});
        setStartNode(null);
        setEndNode(null);
    }
    const resetGraph = () => {
        setDijGraph({nodes: [], edges: []})
    }
    const handleChange = (event) => {
        setWeight(event.target.value);
    };
    
    return (
        
        <section className='w-full h-screen relative'>
            {/* NAVBAR */}
            <div className='algo-nav-background'>
                <div className='algo-header'>DIJKSTRA'S</div>
                <div className='algo-header'>ALGORITHM</div>
                <div className='algo-subtitle'>MST Finder</div>
                <br/>
                <div className='algo-description'>
                    Click below to add a node! 
                </div>
                <button className={'algo-btn'} onClick={addNode}>
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
                <button className={'algo-btn'} onClick={addEdge}>
                    Add Edge {AddIcon}
                </button>
                <button className={'algo-btn'} onClick={resetGraph}>
                    RESET {CrossIcon}
                </button>
                <div className='algo-description'>
                    Press PLAY when ready to
                </div>
                <div className='algo-description'>
                    execute Dijkstra's algorithm.
                </div>
            </div>
        <Graph 
            graph={dijGraph}
            options={options}
            events={{
                selectNode: event => {
                  const { nodes } = event;
                  if (nodes.length > 0) {
                    const clickedNodeId = nodes[0];
                    console.log(clickedNodeId);
                    if (startNode === null) {
                        setStartNode(clickedNodeId);
                    } else if (endNode === null && startNode != clickedNodeId) {
                        setEndNode(clickedNodeId);
                    }
                  }
                },
              }}
        />
        </section>
    )
}

export default Dijkstra