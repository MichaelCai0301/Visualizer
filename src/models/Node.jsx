import { useRef, useEffect, useState, useContext} from "react";
import { useGLTF } from "@react-three/drei";
import node from '../assets/3d/shapes/sphere.glb';
import {a} from '@react-spring/three';
import { Context } from "../pages/Tortoise";



const Node = (props) => {
    const nodeRef = useRef();
    const { nodes, materials } = useGLTF(node);
    const [hovered, setHovered] = useState(false);
    var [coordStack, setCoordStack] = useContext(Context);

    return (
        <a.group ref={nodeRef} {...props}>
            <mesh
                geometry={nodes.Object_2.geometry}
                material={materials["Scene_-_Root"]}
                rotation={[-Math.PI / 2, 0, 0]}
                onPointerEnter={() => {
                    console.log("CC", props.c, coordStack);
                    if (!props.firstNode && props.c === coordStack[coordStack.length-1].c
                        && props.r === coordStack[coordStack.length-1].r) 
                        setHovered(true)  

                }
                }
                onPointerLeave={() => {
                    if (!props.firstNode &&  props.c === coordStack[coordStack.length-1].c
                        && props.r === coordStack[coordStack.length-1].r) 
                    setHovered(false)}
                }
                onClick={()=>{
                    if (!props.firstNode &&  props.c === coordStack[coordStack.length-1].c
                        && props.r === coordStack[coordStack.length-1].r)
                        props.setNodeClicked(true);
                }}
            >
                <meshPhongMaterial emissive={0x060000} emissiveIntensity={hovered == 1 ? 500 : 0}/>
            </mesh>
        </a.group>
    );
}

export default Node;
