
import { useState, useEffect } from 'react';
import title from '../assets/visualizer.gif';

const WebTitle = (props) => {
  const [textColor, setTextColor] = useState({color: "black"});
  const [hide, setHide] = useState(false);
  
  useEffect(() => {
    if (props.hovered == 0) {
      setTextColor({color: "black"});
    } else if (props.hovered == 1) {
      setTextColor({color: "#ffeb14"});
      props.setTypeSelected("Statistics");
    } else if (props.hovered == 2) {
      setTextColor({color:' #ffa8fc'});
      props.setTypeSelected("Algorithms");
    }
    console.log('++'+ props.typeSelected+'++');
  },[props.hovered])

  useEffect(() => {
    if (props.clicked) {
      setHide(true);
    } 
  },[props.clicked])

  return (
    <>
      <div className='title-background'>
        <div className={hide ? 'hide-background' : ''}/>
        <img src={title} alt="loading..." className={'title'}/>
        <h4 className={props.hovered == 0 ? 'subtitle' : 'invisible'} >Hover over a shape to select a category</h4>
        <h4 className={props.hovered != 0 ? 'subtitle' : 'invisible'} style={textColor}>Click the shape to begin visualizing!</h4>
        <h1 className={props.hovered != 0 ? 'selection-type' : 'invisible'} style={textColor}>{props.typeSelected}</h1>
      </div>
    </>
  );
};

export default WebTitle;
