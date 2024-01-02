
import { useState, useEffect } from 'react';
import {Link} from "react-router-dom";

const AlgoNavbar = (props) => {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    if (props.hovered == 1) {
      props.setTypeSelected("tortoise");
    } else if (props.hovered == 2) {
      props.setTypeSelected("dutch");
    }
    console.log('++'+ props.typeSelected+'++');
  },[props.hovered])

  return (
    <>
        <div className='algo-nav-background'>
            <Link to={'/tortoise-and-hare'} className={props.hovered == 1 ? 'algo-title-selected' : 'algo-title'}>Tortoise and Hare</Link>
            <Link to={'/'} className={props.hovered == 2 ? 'algo-title-selected' : 'algo-title'}>Dutch National Flag</Link>
        </div>
    </>
  );
};

export default AlgoNavbar;
