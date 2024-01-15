
import { useState, useEffect } from 'react';
import {Link} from "react-router-dom";

const AlgoNavbar = (props) => {

  useEffect(() => {
    if (props.hovered == 1) {
      props.setTypeSelected("tortoise");
    } else if (props.hovered == 2) {
      props.setTypeSelected("dijkstra");
    }
  },[props.hovered])

  return (
    <>
        <div className='algo-nav-background'>
            <Link to={'/tortoise-and-hare'} style={{ textDecoration: 'none' }} className={props.hovered == 1 ? 'algo-title-selected' : 'algo-title'}>Tortoise and Hare</Link>
            <Link to={'/'} style={{ textDecoration: 'none' }} className={props.hovered == 2 ? 'algo-title-selected' : 'algo-title'}>Dijkstra's Algorithm</Link>
        </div>
    </>
  );
};

export default AlgoNavbar;
