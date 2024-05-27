import { Canvas } from '@react-three/fiber';
import { Suspense, useState } from 'react';
import { Loader } from '../components/Loader';
import Cuboctahedron from '../models/Cuboctahedron';
import Octahedron from '../models/Octahedron';
import T_Icosahedron from '../models/T_Icosahedron';
import Cube from '../models/Cube';
import Tetrahedron from '../models/Tetrahedron';
import AlgoNavbar from '../components/AlgoNavbar';
import { useNavigate } from 'react-router-dom';
import * as ENV from '../Constants'


const Algorithms = () => {
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
    }
    const [shapeScale, shapePosition, shapeRotation] = scaleToScreenSize();

    const handleClick = (e) => {
        setClicked(true);
    }

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
                <AlgoNavbar
                    hovered = {hovered} 
                    setHovered = {setHovered}
                    typeSelected = {typeSelected}
                    setTypeSelected = {setTypeSelected}
                />
                <Canvas className="w-full h-screen bg-transparent" camera={{near: 0.1, far:1000}}>
                    <Suspense fallback={<Loader/>}>
                        <directionalLight position={[1,1,1]} intensity={2}/>
                        <ambientLight intensity={0.5}/>
                        <hemisphereLight skyColor="#b1e1ff" groundColor="#000000" intensity={1} />
                            <Cuboctahedron 
                                position={[20, -80.5, -243]}
                                color={ENV.COLORS.ALGO_HIGHLIGHTED}
                                {...shapeProps}
                            />
                            <T_Icosahedron 
                                position={[-90, 30.5, -283]}
                                color={ENV.COLORS.ALGO_HIGHLIGHTED}
                                {...shapeProps}
                            />
                            <Cube 
                                position={[30, 320.5, -683]}
                                color={ENV.COLORS.ALGO_HIGHLIGHTED}
                                {...shapeProps}
                            />
                            <Tetrahedron 
                                position={[40, -10.5, -73]}
                                color={ENV.COLORS.ALGO_HIGHLIGHTED}
                                {...shapeProps}
                            />
                            <Octahedron 
                                position={shapePosition}
                                color={ENV.COLORS.ALGO_HIGHLIGHTED}
                                {...shapeProps}
                                navigateFunction = {(type) => {
                                    if (type === "tortoise") {
                                        navigate("/tortoise-and-hare");
                                    } else if (type === "dijkstra") {
                                        navigate("/dijkstra");
                                    } else if (type === "bfs") {
                                        navigate("/bfs");
                                    } else if (type === "dfs") {
                                        navigate("/dfs");
                                    } else if (type === "quicksort") {
                                        navigate("/quicksort");
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

export default Algorithms