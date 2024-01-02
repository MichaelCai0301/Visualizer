import {useState} from 'react';
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

    // Shared arrow props
    const arrowProps = {
        scale: arrowScale,
        curNodePos: shapePosition,
        createNode: props.createNode,
        addNode: props.addNode,
        moveDirection: moveDirection,
        setMoveDirection: setMoveDirection,
    };

    return (
        <>
            <Arrow 
                position={startArrowDownPos}
                rotation={downArrowRotation}
                type = {'down'} 
                {...arrowProps}
            />
            <Arrow 
                position={startArrowRightPos}
                rotation={rightArrowRotation}
                type = {'right'} 
                {...arrowProps}            
            />
            <Arrow 
                position={startArrowUpPos}
                rotation={upArrowRotation}
                type = {'up'} 
                {...arrowProps}
            />
            <Arrow 
                position={startArrowLeftPos}
                rotation={leftArrowRotation}
                type = {'left'} 
                {...arrowProps}
            />
        </>
    )
}

export default ArrowSet