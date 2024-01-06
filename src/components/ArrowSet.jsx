import {useState, useEffect} from 'react';
import Arrow from '../models/Arrow';


const ArrowSet = (props) => {
    const [moveDirection, setMoveDirection] = useState("");
   
    
    const leftArrowRotation = [0.1, -0.1, 2];
    const downArrowRotation = [0.3, 0.1, 3.5];
    const rightArrowRotation = [0, 0.47, 5.1];
    const upArrowRotation = [0.1, -0.1, 6.65];
    const arrowScale = [3,3,3];
    const startArrowRightPos = [-1.6,2.9,0];
    const startArrowDownPos = [-2.5,2.1,0];
    const startArrowLeftPos = [-3.4,3,0];
    const startArrowUpPos = [-2.5,3.9,0];

    const shapePosition = [-500, 500, -1063];

    const [appearUp, setAppearUp] = useState(true);
    const [appearLeft, setAppearLeft] = useState(true);
    const [appearDown, setAppearDown] = useState(true);
    const [appearRight, setAppearRight] = useState(true);


    //! IMPORTANT: Row is reversed: position-wise, nodeR should be negative, but when indexing with nodeR,
    //! use -nodeR

    useEffect(() => {
        // Delete arrows if necessary
        if (props.nodeC == 0) {
            setAppearLeft(false);
        } else setAppearLeft(true);
        if (props.nodeC == props.graph[0].length) {
            setAppearRight(false);
        } else setAppearRight(true);
        if (props.nodeR == props.graph[0].length) {
            setAppearDown(false);
        } else setAppearDown(true);
        if (props.nodeR == 0) {
            setAppearUp(false);
        } else setAppearUp(true);
    }, [props.graph])

    useEffect(() => {
        var [r, c] = [props.nodeR, props.nodeC];
        console.log("A", props.nodeR, props.nodeC);
    }, [props.nodeR]);
    useEffect(() => {
        var [r, c] = [props.nodeR, props.nodeC];
        console.log("A", props.nodeR, props.nodeC);
    }, [props.nodeC]);

    useEffect(() => {
        if (props.done) {
            setAppearLeft(false);
            setAppearRight(false);
            setAppearDown(false);
            setAppearUp(false);
        }
    }, [props.done]);


    // Shared arrow props
    const arrowProps = {
        scale: arrowScale,
        curNodePos: shapePosition,
        createNode: props.createNode,
        addNode: props.addNode,
        moveDirection: moveDirection,
        setMoveDirection: setMoveDirection,
        nodeR: props.nodeR,
        nodeC: props.nodeC,
        setNodeR: props.setNodeR,
        setNodeC: props.setNodeC,
        done: props.done,
        setDone: props.setDone,
        nodeClicked: props.nodeClicked,
        setNodeClicked: props.setNodeClicked,
        deleteNode: props.deleteNode
    };

    return (
        <>
            <Arrow 
                position={startArrowDownPos}
                rotation={downArrowRotation}
                type = {'down'} 
                appear={appearDown}
                onClick = {() => props.setNodeDir('down')}
                {...arrowProps}
            />
            <Arrow 
                position={startArrowRightPos}
                rotation={rightArrowRotation}
                type = {'right'} 
                appear={appearRight}
                onClick = {() => props.setNodeDir('right')}
                {...arrowProps}            
            />
            <Arrow 
                position={startArrowUpPos}
                rotation={upArrowRotation}
                type = {'up'} 
                appear={appearUp}
                onClick = {() => props.setNodeDir('up')}
                {...arrowProps}
            />
            <Arrow 
                position={startArrowLeftPos}
                rotation={leftArrowRotation}
                type = {'left'} 
                appear={appearLeft}
                onClick = {() => props.setNodeDir('left')}
                {...arrowProps}
            />
        </>
    )
}

export default ArrowSet