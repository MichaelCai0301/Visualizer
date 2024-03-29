import { useRef, useEffect, useState } from "react";
import turtle from '../assets/turtle.gif';
import {a} from '@react-spring/three';
import {Html} from '@react-three/drei';


const Turtle = (props) => {
    const turtRef = useRef();
    const initPos = [-3.6,3,0];
    useEffect(() => {
        if (props.playing) {
            turtRef.current.position.x = 0.8; // setting initial position, visiting root node
            var firstNode = props.nodes[0][0];
            const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
            (function loop(i,curNode) {
                if (props.result.length > 0 || i >= 50 || curNode == null || !props.playing) {
                    delay(1000).then(() => {
                        props.setPlaying(false);
                    });
                    return;
                } 
                delay(1000).then(() => {
                    if (turtRef.current !== null) {
                        turtRef.current.position.x = (curNode.c) * 1.5 + 0.8;   //wx+b
                        turtRef.current.position.y = -(curNode.r) * 1.5 + 0;    //wy+b
                        props.setPos([curNode.c, curNode.r]);
                        loop(i+1, curNode.next);
                    }
                });
            })(0,firstNode.next); // start by visiting root.next (already visited root node)
        } else {
            turtRef.current.position.x = 0;
            turtRef.current.position.y = 0;
        }
    }, [props.playing]);

    return (
        <>
            <a.group ref={turtRef} {...props}>
                <Html
                    position={initPos}
                    >
                        <img src={turtle} style={{height: "8vh" }}
                        alt="loading..."
                    />
                </Html>
            </a.group>
        </>
    );
}

export default Turtle;
