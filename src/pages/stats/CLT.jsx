import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddIcon from '../../assets/svg/add_svg';
import BackIcon from '../../assets/svg/back_svg';
import '../../components/Popup.css';
import 'react-toastify/dist/ReactToastify.css';
import * as RAND from './DistLib'
import DistUI from './DistUI';
import CrossIcon from '../../assets/svg/x_svg';
const CLT = () => {
    const navigate = useNavigate();
    const [observations, setObservations] = useState(new Map());
    const [distribution, setDistribution] = useState("Normal");
    const [param1, setParam1] = useState(0);
    const [param2, setParam2] = useState(1);
    const [EV, setEV] = useState(0);
    const [min, setMin] = useState(Infinity)
    const [max, setMax] = useState(-Infinity)
    const [means, setMeans] = useState([]);
    const [curMean, setCurMean] = useState({numerator:0,denom:0});

    const addObs = () => {

        // Create randVar
        var randVar;
        if (distribution === "Binomial") {
            console.log("bin");
            randVar = RAND.DIST.BIN(param1,param2/100);
        } else if (distribution === "Uniform") {
            console.log("unif");
            randVar = RAND.DIST.UNIF(param1,param2);
        } else {
            
            randVar = RAND.DIST.NORM(param1,param2); 
            console.log("norm", param1, param2, randVar);
        }

        // Update mean
        setCurMean({numerator: curMean.numerator+randVar,
                    denom: curMean.denom+1});
        setMeans([...means, (curMean.numerator+randVar)/(curMean.denom+1)]);
                
        // Add randVar to map
        if (observations.has(randVar)) {
            setObservations(new Map(observations.set(randVar, observations.get(randVar)+1)));
        } else {
            let unsortedMap = observations;
            if (randVar < min) {
                if (min == Infinity) {
                    unsortedMap = new Map(unsortedMap.set(randVar, 1));
                } else {
                    for (let i = randVar; i < min; i++) {
                        unsortedMap = new Map(unsortedMap.set(i, i==randVar ? 1 : 0));
                    }
                }
                setMin(randVar)
            }
            if (randVar > max) {
                if (max == -Infinity) {
                    unsortedMap = new Map(unsortedMap.set(randVar, 1));
                } else {
                    for (let i = randVar; i > max; i--) {
                        unsortedMap = new Map(unsortedMap.set(i, i==randVar ? 1 : 0));
                    }
                }
                setMax(randVar)
            }
                
            setObservations(new Map([...unsortedMap.entries()].sort((a, b) =>
                {
                    if (a[0] < b[0]) return -1;
                    if (a[0] > b[0]) return 1;
                    return 0;
                }
            )));
        }
        console.log(randVar);
    }

    const resetData = () => {
        setObservations(new Map());
        setMin(Infinity);
        setMax(-Infinity);
        setMeans([]);
    };

    const distChange = (event) => {
        setDistribution(event.target.value);
        if (event.target.value === "Binomial") {
            console.log("bin");
            setParam1(50);
            setParam2(40);
            setEV(20);
        } else if (event.target.value === "Uniform") {
            console.log("unif");
            setParam1(-3);
            setParam2(3);
            setEV(0);
        } else {
            console.log("norm");
            setParam1(0);
            setParam2(1);
            setEV(0);
        }
    };

    useEffect (() => {
        resetData();
    }, [distribution])

    const param1Change = (event) => {
        resetData();
        setParam1(parseInt(event.target.value));
        if (distribution === "Binomial") {
            console.log("bin");
            setEV(parseInt(event.target.value) * param2);
        } else if (distribution === "Uniform") {
            console.log("unif");
            setEV((parseInt(event.target.value) + param2)/2);
        } else {
            console.log("norm");
            setEV(parseInt(event.target.value));
        }
    };

    const param2Change = (event) => {
        resetData();
        setParam2(parseInt(event.target.value));
        if (distribution === "Binomial") {
            console.log("bin");
            setEV(parseInt(event.target.value) * param1);
        } else if (distribution === "Uniform") {
            console.log("unif");
            setEV((parseInt(event.target.value) + param1)/2);
        } 
    };

    useEffect(() => {
        console.log(param1, param2)
    }, [param1, param2])


    // Data for line graph
    const labels = Array.from({ length: means.length }, (_, i) => i + 1);;

    const data = {
        labels,
        datasets: [
            {
            label: 'Means from Data',
            data: means,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
            label: 'Expected Mean',
            data: Array(means.length).fill(EV),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    return (
        <> 
            {/* SIDEBAR */}
            <section className='w-full h-screen relative'>
                <div className='nav-background'>
                    <div className='stat-header'>LAW OF </div>
                    <div className='stat-header'>LARGE </div>
                    <div className='stat-header'>NUMBERS </div>
                    <div className='stat-subtitle'>Convergence to</div>
                    <div className='stat-subtitle'>True Mean</div>
                    <hr className="rounded" />
                    <div className='description'>Choose a distribution:</div>
                    <div className='custom-select'>
                        <select id="dropdown" value={distribution} onChange={distChange}>
                            <option value="Normal">Normal</option>
                            <option value="Binomial">Binomial</option>
                            <option value="Uniform">Uniform</option>
                        </select>
                    </div>
                    <div className='description'>Selected Value: {distribution}</div>
                    <br/>
                    <button className={'stat-btn'} onClick={addObs}>
                            Add Data {AddIcon}
                    </button>
                    <br/>
                    <div className='description'>
                            {distribution === "Normal" ? "Set mean:" : distribution === "Uniform" ? "Set min:" : "Set # trials:"}
                    </div>
                    <form>
                        <input
                            type="number"
                            value={param1}
                            onChange={param1Change}
                            placeholder={0}
                            style={{width: "5vw"}}
                        />
                    </form>
                    <div className='description'>
                            {distribution === "Normal" ? "Set SD:" : distribution === "Uniform" ? "Set max:" : "Set success rate (%):"}
                    </div>
                    <form>
                        <input
                            type="number"
                            value={param2}
                            onChange={param2Change}
                            placeholder={1}
                            style={{width: "5vw"}}
                            max={100}
                            min={0}
                        />
                    </form>
                    <hr className="rounded" />
                    <br/>
                    <button className={'stat-btn'} onClick={resetData}>
                        RESET {CrossIcon}
                    </button>
                    <br/>
                    <button onClick={() => navigate(-1)} className="stat-back-btn">
                        BACK {BackIcon}
                    </button>
                </div>
                <DistUI data={Array.from(observations.values())}
                    labels={Array.from(observations.keys())} />
                <div className='border-container'>
                    <div className='bottom-border'>
                        <div>LAST ADDED DATA</div>
                    </div>
                </div>
                <div className='border-content'>
                    <DistUI data={Array.from(observations.values())}
                            labels={Array.from(observations.keys())}
                            w={60}
                    />
                </div>
                
                
            </section>
        </>
    )
}

export default CLT