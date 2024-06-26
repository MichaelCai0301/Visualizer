import { Canvas } from '@react-three/fiber';
import { Suspense, useState } from 'react';
import { Loader } from '../components/Loader';
import Cuboctahedron from '../models/Cuboctahedron';
import Octahedron from '../models/Octahedron';
import WebTitle from '../components/WebTitle';
import { useNavigate } from "react-router-dom";
import * as ENV from '../Constants'


const Home = () => {
    const [hovered, setHovered] = useState(0);
    const [clicked, setClicked] = useState(false);
    const [typeSelected, setTypeSelected] = useState(""); 
    const navigate = useNavigate(); 


    const scaleToScreenSize = () => {
        let screenScale = null;
        let screenPosition = [80, 40.5, -103];
        let rotation = [0.1, 4.7, 0];
        if (window.innerWidth < 768) {
            screenScale = [10, 10, 10];
        } else {
            screenScale =  [10, 10, 10];
        }
        return [screenScale, screenPosition, rotation];
    };
    const [shapeScale, shapePosition, shapeRotation] = scaleToScreenSize();

    const handleClick = (e) => {
        setClicked(true);
    };

    // Props shared by shapes
    const shapeProps = {
        scale: shapeScale,
        rotation: shapeRotation,
        onClick: handleClick,
        hovered: hovered,
        setHovered: setHovered,
        clicked: clicked,
        setClicked: setClicked,
        typeSelected: typeSelected,
        setTypeSelected: setTypeSelected
    };

    return (
        <>
            <section className='w-full h-screen relative'>
                <WebTitle 
                    hovered = {hovered} 
                    setHovered = {setHovered}
                    clicked = {clicked}
                    setClicked = {setClicked}
                    typeSelected = {typeSelected}
                    setTypeSelected = {setTypeSelected}
                />
                <Canvas className="w-full h-screen bg-transparent" camera={{near: 0.1, far:1000}}>
                    <Suspense fallback={<Loader/>}>
                        <directionalLight position={[1,1,1]} intensity={2}/>
                        <ambientLight intensity={0.5}/>
                        <hemisphereLight skyColor="#b1e1ff" groundColor="#000000" intensity={1} />
                            <Cuboctahedron 
                                position={[50, -80.5, -243]}
                                color={ENV.COLORS.ALGO_HIGHLIGHTED}
                                {...shapeProps}
                            />
                            <Octahedron 
                                position={shapePosition}
                                color={ENV.COLORS.STAT_HIGHLIGHTED}
                                {...shapeProps}
                                navigateFunction = {(type) => {
                                    if (type === "Statistics") {
                                        console.log('stats');
                                        navigate("/statistics");
                                    } else if (type === "Algorithms") {
                                        console.log('algo');
                                        navigate("/algorithms");
                                    } else {
                                        console.log('nothing');
                                        navigate(0); // Refresh
                                    }
                                }}
                            />
                    </Suspense>
                </Canvas> 
            </section>
        </>
    )
}

export default Home