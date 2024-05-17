import { useRef, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import node from '../assets/3d/shapes/sphere.glb';
import {a} from '@react-spring/three';
import Tube from "./Tube";


const Node = (props) => {
    const nodeRef = useRef();
    const { nodes, materials } = useGLTF(node);

    const vertTubeRotation = props.vertTubeRotation;
    const horizTubeRotation = props.horizTubeRotation;
    const tubeScale = props.tubeScale;
    const startTubeRightPos = props.startTubeRightPos;
    const startTubeDownPos = props.startTubeDownPos;
    const startTubeLeftPos = props.startTubeLeftPos;
    const startTubeUpPos = props.startTubeUpPos;
    const horizTubeScaleFactor = props.horizTubeScaleFactor;
    const vertTubeScaleFactor = props.vertTubeScaleFactor;


    const rotation = props.direction === "right" || props.direction === "left" ? horizTubeRotation : vertTubeRotation;
    var position = startTubeRightPos;

    if (props.direction === "right") position = startTubeLeftPos;
    else if (props.direction === "up") position = startTubeDownPos;
    else if (props.direction === "down") position = startTubeUpPos
    position[0] += props.nodeCoords.c * horizTubeScaleFactor;
    position[1] -= props.nodeCoords.r * vertTubeScaleFactor;

    var new_pos = props.new_posRight;
    var new_rot = props.new_rotHoriz;
    if (props.direction === "left") {
        new_pos = props.new_posLeft;
        new_rot = props.new_rotHoriz;
    } else if (props.direction === "up") {
        new_pos = props.new_posUp;
        new_rot = props.new_rotVert;
    } else if (props.direction === "down") {
        new_pos = props.new_posDown;
        new_rot = props.new_rotVert;
    }

    return (
        <>
            <a.group ref={nodeRef} {...props}>
                <mesh
                    geometry={nodes.Object_2.geometry}
                    material={materials["Scene_-_Root"]}
                    rotation={[-Math.PI / 2, 0, 0]}
                >
                    <meshPhongMaterial />
                </mesh>
            </a.group>
            <Tube
                position = {position}
                new_pos = {new_pos}
                rotation = {rotation}
                appear = {props.direction === "right" || props.direction === "left" || 
                    props.direction === "up" || props.direction === "down"}
                scale = {props.direction === "right" || props.direction === "up" ? props.tubeScaleRightUp :
                    props.tubeScaleLeftDown}
                new_rot = {new_rot}
            />
        </>
    );
}

export default Node;
