
import { useState, useEffect } from 'react';
import {Link} from "react-router-dom";

const StatNavbar = (props) => {

  useEffect(() => {
    switch (props.hovered) {
      case 0:
      case 1:
        props.setTypeSelected("lln");
        break;
      case 2:
        props.setTypeSelected("clt");
        break;
      default:
        alert(`ERR: Impossible selection: ${props.hovered}.`);
    }
  },[props.hovered])

  return (
    <>
        <div className='nav-background'>
            <Link to={'/lln'} style={{ textDecoration: 'none' }} 
              className={props.hovered == 1 ? 'stat-title-selected' : 'stat-title'}>Law of Large Numbers</Link>
            <Link to={'/clt'} style={{ textDecoration: 'none' }} 
              className={props.hovered == 2 ? 'stat-title-selected' : 'stat-title'}>Central Limit Theorem</Link>
        </div>
    </>
  );
};

export default StatNavbar;
