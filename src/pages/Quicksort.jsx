import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useEffect, useRef} from 'react';
import { Loader } from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import AddIcon from '../assets/svg/add_svg';
import CrossIcon from '../assets/svg/x_svg';
import PlayingIcon from '../assets/svg/playing_svg';
import PlayIcon from '../assets/svg/play_svg';
import * as ENV from '../Constants'
import BackIcon from '../assets/svg/back_svg';
import Popup from 'reactjs-popup';
import '../components/Popup.css';
import SortingUI from './SortingUI';

const Quicksort = () => { 
    const [curElt, setCurElt] = useState(0);
    const [curArr, setCurArr] = useState([]);
    const [playing, setPlaying] = useState(false);
    const [pivotIdx, setPivotIdx] = useState(-1);
    const [delay, setDelay] = useState(200);        // Same as run speed
    const navigate = useNavigate(); 

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    async function quickSort(arr, low, high) {
        if (low < high) {
            const pi = await partition(arr, low, high, delay);
            console.log(arr[high])
            console.log(`Pivot is now at index ${pi}, ${arr[pi]}:`, arr);
    
            await quickSort(arr, low, pi - 1, delay);
            await quickSort(arr, pi + 1, high, delay);
        }
    }
    
    async function partition(arr, low, high, delay) {
        const pivot = arr[high];
        setPivotIdx(high);
        console.log("PIVOT:", pivot)
        let i = low - 1;
    
        for (let j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                setCurArr(arr);
                await sleep(delay);
                console.log(`Swapped ${arr[i]} and ${arr[j]}:`, arr);
            }
        }
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        setCurArr(arr);
        await sleep(delay);
        console.log(`Swapped pivot ${arr[i + 1]} and ${arr[high]}:`, arr);
    
        return i + 1;
    }
    
    async function startQuickSort(arr) {
        console.log('Starting QuickSort:', curArr);
        await quickSort(curArr, 0, curArr.length - 1);
        console.log('QuickSort Completed:', curArr);
    }
    
    const resetArr = () => {
        if (playing) return;
        setCurArr([]);
    }

    const addElt = () => {
        if (playing) return;
        setCurArr([...curArr, curElt]);
    }

    const play = async () => {
        if (playing) return; // Can't play while already playing  
        setPlaying(true);
        await startQuickSort();
        setPlaying(false);
    }

    useEffect (() => {
        if (!playing) {
            setPivotIdx(-1);
        }
    }, [playing])

    // HELPER: Updates elt change in form
    const handleChange = (event) => {
        if (playing) return;
        setCurElt(parseInt(event.target.value));
    };

    // HELPER: Updates run speed/delay change in form
    const delayChange = (event) => {
        if (playing) return;
        setDelay(parseInt(event.target.value));
    };

    
    return (
        <>
            <section className='w-full h-screen relative'>
                <div className='nav-background'>
                    <div className='algo-header'>QUICKSORT </div>
                    <div className='algo-subtitle'>List/Array Sorting</div>
                    <br/>
                    <div className='description'>
                            Set run speed (ms):
                    </div>
                    <form>
                        <input
                            type="number"
                            value={delay}
                            onChange={delayChange}
                            placeholder={200}
                            style={{width: "5vw"}}
                        />
                    </form>
                    <hr className="rounded" />
                    <div className='nav-background-no-animation'>
                        <div className='description'>
                            Add an element below! 
                        </div>
                        <div className='algo-description-special-1'>Element Value: </div>
                        <form>
                            <input
                                type="number"
                                value={curElt}
                                onChange={handleChange}
                                placeholder={0}
                                style={{width: "5vw"}}
                            />
                        </form>
                        <button className={playing ? 'btn-disabled' : 'algo-btn'} onClick={addElt}>
                            Add Element {AddIcon}
                        </button>
                    </div>
                    <hr className="rounded" />
                    <br/>
                    <button className={playing ? 'btn-disabled' : 'algo-btn'} onClick={resetArr}>
                        RESET {CrossIcon}
                    </button>
                    <br/>
                    <button className={playing ? 'btn-disabled' : 'algo-btn'} onClick={play}>
                        PLAY
                        {playing ? PlayingIcon : PlayIcon}
                    </button>
                    <br/>
                    <button onClick={() => navigate(-1)} className="algo-back-btn">
                        BACK {BackIcon}
                    </button>
                </div>
                <SortingUI data={curArr} pivotIdx={pivotIdx}/>
            </section>
        </>
    )
}
export default Quicksort