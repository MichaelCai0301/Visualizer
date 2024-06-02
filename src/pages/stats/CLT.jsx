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
    const [means, setMeans] = useState(new Map());
    const [distribution, setDistribution] = useState("Normal");
    const [param1, setParam1] = useState(0);
    const [param2, setParam2] = useState(1);
    const [sampleSz, setSampleSz] = useState(25);
    const [EV, setEV] = useState(0);
    const [meanMin, setMeanMin] = useState(Infinity)
    const [meanMax, setMeanMax] = useState(-Infinity)
    const [curMean, setCurMean] = useState(0);

    const addObs = () => {
        var curObs = new Map();
        var min = Infinity;
        var max = -Infinity;
        // Create randVar
        for (let i = 0; i < sampleSz; i++) {
            var randVar;
            if (distribution === "Binomial") {
                console.log("bin");
                randVar = RAND.DIST.BIN(param1,param2/100);
            } else if (distribution === "Uniform") {
                console.log("unif");
                randVar = RAND.DIST.UNIF(param1,param2);
            } else {
                
                randVar = RAND.DIST.NORM(param1,param2); 
            }
            // Add randVar to map
            if (curObs.has(randVar)) {
                curObs.set(randVar, curObs.get(randVar)+1);
            } else {
                let unsortedMap = curObs;
                if (randVar < min) {
                    if (min == Infinity) {
                        unsortedMap = new Map(unsortedMap.set(randVar, 1));
                    } else {
                        for (let i = randVar; i < min; i++) {
                            unsortedMap = new Map(unsortedMap.set(i, i==randVar ? 1 : 0));
                        }
                    }
                    min = randVar;
                }
                if (randVar > max) {
                    if (max == -Infinity) {
                        unsortedMap = new Map(unsortedMap.set(randVar, 1));
                    } else {
                        for (let i = randVar; i > max; i--) {
                            unsortedMap = new Map(unsortedMap.set(i, i==randVar ? 1 : 0));
                        }
                    }
                    max = randVar;
                }
                curObs = (new Map([...unsortedMap.entries()].sort((a, b) =>
                    {
                        if (a[0] < b[0]) return -1;
                        if (a[0] > b[0]) return 1;
                        return 0;
                    }
                )));
            }
        }
        setObservations(curObs);
        console.log(curObs);
    }

    useEffect(() => {
        if (observations.size != 0) {
            // Update mean
            var newMean = 0;
            for (let [key, value] of observations) {
                newMean += key * value;
            }
            newMean = parseFloat((newMean/sampleSz).toFixed(1));
            console.log("NM", newMean);
            if (means.has(newMean)) {
                console.log("HAS", means)
                setMeans(new Map(means.set(newMean, means.get(newMean)+1)));
            } else {
                let unsortedMap = means;
                console.log(meanMax,meanMin)
                if (newMean < meanMin) {
                    if (meanMin == Infinity) {
                        unsortedMap = new Map(unsortedMap.set(newMean, 1));
                    } else {
                        for (let i = newMean*10; i < meanMin*10; i+=1) {
                            unsortedMap = new Map(unsortedMap.set(i/10, i/10==newMean ? 1 : 0));
                        }
                    }
                    setMeanMin(newMean);
                }
                if (newMean > meanMax) {
                    if (meanMax == -Infinity) {
                        unsortedMap = new Map(unsortedMap.set(newMean, 1));
                    } else {
                        for (let i = newMean*10; i > meanMax*10; i-=1) {
                            unsortedMap = new Map(unsortedMap.set(i/10, i/10==newMean ? 1 : 0));
                        }
                    }
                    setMeanMax(newMean);
                }
                let ordered = new Map([...unsortedMap.entries()].sort((a, b) =>
                    {
                        if (a[0] < b[0]) return -1;
                        if (a[0] > b[0]) return 1;
                        return 0;
                    }
                ));
                console.log("SET", ordered)
                setMeans(ordered);
            }
        }
    }, [observations])

    const resetData = () => {
        setMeans(new Map());
        setObservations(new Map());
        setMeanMin(Infinity);
        setMeanMax(-Infinity);
    };

    const distChange = (event) => {
        setDistribution(event.target.value);
        if (event.target.value === "Binomial") {
            console.log("bin");
            setParam1(10);
            setParam2(10);
            setEV(20);
        } else if (event.target.value === "Uniform") {
            console.log("unif");
            setParam1(-1);
            setParam2(1);
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

    const sampleSzChange = (event) => {
        if (event.target.value == "") setSampleSz(1);      
        else setSampleSz(parseInt(event.target.value));
    };

    useEffect(() => {
        console.log(param1, param2)
    }, [param1, param2])


    return (
        <> 
            {/* SIDEBAR */}
            <section className='w-full h-screen relative'>
                <div className='nav-background'>
                    <div className='stat-header'>CENTRAL </div>
                    <div className='stat-header'>LIMIT </div>
                    <div className='stat-header'>THEOREM </div>
                    <div className='stat-subtitle'>Normality of</div>
                    <div className='stat-subtitle'>Sample Means</div>
                    <hr className="rounded" />
                    <div className='description'>Choose a distribution:</div>
                    <div className='custom-select'>
                        <select id="dropdown" value={distribution} onChange={distChange}>
                            <option value="Normal">Normal</option>
                            <option value="Binomial">Binomial</option>
                            <option value="Uniform">Uniform</option>
                        </select>
                    </div>
                    <div className='description'>
                            Set Sample Size
                    </div>
                    <form>
                        <input
                            type="number"
                            value={sampleSz}
                            onChange={sampleSzChange}
                            placeholder={1}
                            style={{width: "5vw"}}
                            min={1}
                        />
                    </form>
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
                <DistUI data={Array.from(means.values())}
                    labels={Array.from(means.keys())} />
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