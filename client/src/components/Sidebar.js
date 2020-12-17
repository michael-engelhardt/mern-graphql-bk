import React from "react";
import "./Sidebar.css";
import MenuBar from './MenuBar'
import buecherkreis_logo from '../images/buecherkreis_logo.png'

function Sidebar() {
  return (
    <div className="sidebar">
      <img src={buecherkreis_logo} alt="" className="sidebar__Icon" />
        <MenuBar />
    </div>
  );
}

export default Sidebar;
