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

    const [nodeR, setNodeR] = useState(0);
    const [nodeC, setNodeC] = useState(0);

    useEffect(() => {
        // Delete arrows if necessary
        if (nodeC == 0 || props.graph[nodeR][nodeC-1] !== undefined) {
            setAppearLeft(false);
        } else setAppearLeft(true);
        if (nodeC == props.graph[0].length || props.graph[nodeR][nodeC+1] !== undefined) {
            setAppearRight(false);
        } else setAppearRight(true);
        if (nodeR == props.graph[0].length || props.graph[nodeR+1][nodeC] !== undefined) {
            setAppearDown(false);
        } else setAppearDown(true);
        if (nodeR == 0 || props.graph[nodeR-1][nodeC] !== undefined) {
            setAppearUp(false);
        } else setAppearUp(true);
        
    }, [props.graph])

    

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
        setNodeC: setNodeC
    };

    return (
        <>
            <Arrow 
                position={startArrowDownPos}
                rotation={downArrowRotation}
                type = {'down'} 
                appear={appearDown}
                {...arrowProps}
            />
            <Arrow 
                position={startArrowRightPos}
                rotation={rightArrowRotation}
                type = {'right'} 
                appear={appearRight}
                {...arrowProps}            
            />
            <Arrow 
                position={startArrowUpPos}
                rotation={upArrowRotation}
                type = {'up'} 
                appear={appearUp}
                {...arrowProps}
            />
            <Arrow 
                position={startArrowLeftPos}
                rotation={leftArrowRotation}
                type = {'left'} 
                appear={appearLeft}
                {...arrowProps}
            />
        </>
    )
}

export default ArrowSet