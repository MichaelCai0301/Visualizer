import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useEffect, useRef} from 'react';
import { Loader } from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import Graph from 'react-graph-vis'
import graph from '../components/graph';
import { Network } from 'vis-network';
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
    height: "500px"
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
    const handleChange = (event) => {
        setWeight(event.target.value);
    };
    return (
        <section className='w-full h-screen relative'>
        <h1 onClick={addNode}>add node!</h1>
        <h1 onClick={addEdge}>input a weight here, click 2 nodes, and then click here to add an edge btw those nodes!</h1>
        <input
            type="number"
            value={weight}
            onChange={handleChange}
            placeholder="Enter a weight"
        />
        <h1>node 1: {startNode}</h1>
        <h1>node 2: {endNode}</h1>
        <h1>edge weight: {weight}</h1>
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