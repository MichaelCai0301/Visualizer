import { useRef, useEffect, useState } from "react";
import hare from '../assets/hare.gif';
import {a} from '@react-spring/three';
import {Html} from '@react-three/drei';

const Hare = (props) => {
    const hareRef = useRef();
    const initPos = [-4.5,3.7,0];
    useEffect(() => {
        if (props.playing) {
            hareRef.current.position.x = 1.65; // setting initial position, visiting root node
            var firstNode = props.nodes[0][0];
            const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
            if (firstNode.next) {
                (function loop(i,curNode) {
                    console.log(curNode,i);
                    if (props.result.length > 0 || i >= 50 || curNode == null || curNode.next == null) {
                        delay(1000).then(() => {
                            props.setPos([-1,-1]);
                            props.setPlaying(false);
                        });
                        return;
                    } 
                    delay(1000).then(() => {
                        hareRef.current.position.x = (curNode.c) * 1.5 + 1.6;   // wx+b1
                        hareRef.current.position.y = -(curNode.r) * 1.5 + 0;    // wy+b2
                        props.setPos([curNode.c, curNode.r]);
                        loop(i+1, curNode.next.next);
                    });
                })(0,firstNode.next.next); // start by visiting root.next (already visited root node)
            }
            else {
                props.setPlaying(false);
            }
        } else {
            hareRef.current.position.x = 0;
            hareRef.current.position.y = 0;
        }
    }, [props.playing]);

    return (
        <>
            <a.group ref={hareRef} {...props}>
                <Html
                    position={initPos}
                    >
                        <img src={hare} 
                        alt="loading..."
                    />
                </Html>
            </a.group>
        </>

    );
}

export default Hare;
