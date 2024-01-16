import { useRef, useEffect, useState } from "react";
import hare from '../assets/hare.gif';
import {a} from '@react-spring/three';
import {Html} from '@react-three/drei';

const Hare = (props) => {
    const hareRef = useRef();
    const initPos = [-3.6,3.7,0];
    useEffect(() => {
        if (props.playing) {
            hareRef.current.position.x = 0.8; // setting initial position, visiting root node
            var firstNode = props.nodes[0][0];
            const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
            if (firstNode.next) {
                (function loop(i,curNode) {
                    if (props.result.length > 0 || i >= 50 || curNode == null) {
                        delay(1000).then(() => {
                            props.setPos([-1,-1]);
                            props.setReachedEnd(true);
                            props.setPlaying(false);
                        });
                        return;
                    } 
                    delay(1000).then(() => {
                        if (hareRef.current !== null) {
                            hareRef.current.position.x = (curNode.c) * 1.5 + 0.8;   // wx+b1
                            hareRef.current.position.y = -(curNode.r) * 1.5 + 0;    // wy+b2
                            props.setPos([curNode.c, curNode.r]);
                            if (curNode.next == null) {
                                delay(1000).then(() => {
                                    props.setPos([-1,-1]);
                                    props.setReachedEnd(true);
                                    props.setPlaying(false);
                                });
                                return;
                            }
                            loop(i+1, curNode.next.next);
                        }
                    });
                })(0,firstNode.next.next); // start by visiting root.next (already visited root node)
            }
            else {
                props.setReachedEnd(true);
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
                        <img src={hare} style={{height: "8vh" }}
                        alt="loading..."
                    />
                </Html>
            </a.group>
        </>

    );
}

export default Hare;
