import {useState, useEffect} from 'react';
import Arrow from '../models/Arrow';


const ArrowSet = (props) => {
    const [moveDirection, setMoveDirection] = useState("");
   
    
    const leftArrowRotation = [0.1, -0.1, 2];
    const downArrowRotation = [0.3, 0.1, 3.5];
    const rightArrowRotation = [0, 0.47, 5.1];
    const upArrowRotation = [0.1, -0.1, 6.65];
    const arrowScale = [1.5,1.5,1.5];
    const startArrowRightPos = [-1.7,3,0];
    const startArrowDownPos = [-2.5,2.2,0];
    const startArrowLeftPos = [-3.3,3,0];
    const startArrowUpPos = [-2.52,3.78,0];

    const shapePosition = [-500, 500, -1063];

    const [appearUp, setAppearUp] = useState(true);
    const [appearLeft, setAppearLeft] = useState(true);
    const [appearDown, setAppearDown] = useState(true);
    const [appearRight, setAppearRight] = useState(true);

    const [nodeR, setNodeR] = useState(0);
    const [nodeC, setNodeC] = useState(0);

    //! IMPORTANT: Row is reversed: position-wise, nodeR should be negative, but when indexing with nodeR,
    //! use -nodeR

    useEffect(() => {
        // Delete arrows if necessary
        if (nodeC == 0) {
            setAppearLeft(false);
        } else setAppearLeft(true);
        if (nodeC == props.graph[0].length) {
            setAppearRight(false);
        } else setAppearRight(true);
        if (nodeR == props.graph[0].length) {
            setAppearDown(false);
        } else setAppearDown(true);
        if (nodeR == 0) {
            setAppearUp(false);
        } else setAppearUp(true);
        
    }, [props.graph])


    // Reset arrows + node position if graph is reset
    useEffect(() => {
        setAppearUp(false);
        setAppearLeft(false);
        setNodeC(0);
        setNodeR(0);
    }, [props.reset])

    useEffect(() => {
        if (props.done) {
            setAppearLeft(false);
            setAppearRight(false);
            setAppearDown(false);
            setAppearUp(false);
            props.setDone(false);
        }
    }, [props.done])

    // Shared arrow props
    const arrowProps = {
        scale: arrowScale,
        curNodePos: shapePosition,
        createNode: props.createNode,
        addNode: props.addNode,
        moveDirection: moveDirection,
        setMoveDirection: setMoveDirection,
        nodeR: nodeR,
        nodeC: nodeC,
        setNodeR: setNodeR,
        setNodeC: setNodeC,
        done: props.done,
        setDone: props.setDone,
        reset: props.reset,
        setReset: props.setReset,
    };

    return (
        <>
            <Arrow 
                position={startArrowDownPos}
                rotation={downArrowRotation}
                type = {'down'} 
                appear={appearDown && !props.playing && !props.turtPlay}
                {...arrowProps}
            />
            <Arrow 
                position={startArrowRightPos}
                rotation={rightArrowRotation}
                type = {'right'} 
                appear={appearRight && !props.playing && !props.turtPlay}
                {...arrowProps}            
            />
            <Arrow 
                position={startArrowUpPos}
                rotation={upArrowRotation}
                type = {'up'} 
                appear={appearUp && !props.playing && !props.turtPlay}
                setAppear = {setAppearUp}
                {...arrowProps}
            />
            <Arrow 
                position={startArrowLeftPos}
                rotation={leftArrowRotation}
                type = {'left'} 
                appear={appearLeft && !props.playing && !props.turtPlay}
                setAppear = {setAppearLeft}
                {...arrowProps}
            />
        </>
    )
}

export default ArrowSet