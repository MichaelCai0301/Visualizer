
import { useState, useEffect } from 'react';
import {Link} from "react-router-dom";

const AlgoNavbar = (props) => {

  useEffect(() => {
    switch (props.hovered) {
      case 0:
      case 1:
        props.setTypeSelected("tortoise");
        break;
      case 2:
        props.setTypeSelected("dijkstra");
        break;
      case 3:
        props.setTypeSelected("bfs");
        break;
      case 4:
        props.setTypeSelected("dfs");
        break;
      case 5:
        props.setTypeSelected("quicksort");
        break;
      default:
        alert(`ERR: Impossible selection: ${props.hovered}.`);
    }
  },[props.hovered])

  return (
    <>
        <div className='nav-background'>
            <Link to={'/tortoise-and-hare'} style={{ textDecoration: 'none' }} 
              className={props.hovered == 1 ? 'algo-title-selected' : 'algo-title'}>Tortoise and Hare</Link>
            <Link to={'/dijkstra'} style={{ textDecoration: 'none' }} 
              className={props.hovered == 2 ? 'algo-title-selected' : 'algo-title'}>Dijkstra's Algorithm</Link>
            <Link to={'/bfs'} style={{ textDecoration: 'none' }} 
              className={props.hovered == 3 ? 'algo-title-selected' : 'algo-title'}>Breadth First Search</Link>
            <Link to={'/dfs'} style={{ textDecoration: 'none' }} 
              className={props.hovered == 4 ? 'algo-title-selected' : 'algo-title'}>Depth First Search</Link>
            <Link to={'/quicksort'} style={{ textDecoration: 'none' }} 
              className={props.hovered == 5 ? 'algo-title-selected' : 'algo-title'}>Quicksort</Link>
        </div>
    </>
  );
};

export default AlgoNavbar;
