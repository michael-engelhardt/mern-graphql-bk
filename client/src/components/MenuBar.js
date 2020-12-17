import React, { useContext, useState } from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../context/auth';

import './MenuBar.css'

function MenuBar() {
  const { user, logout } = useContext(AuthContext);
  const pathname = window.location.pathname;

  const path = pathname === '/' ? 'home' : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(path);

  const handleItemClick = (e, { name }) => setActiveItem(name);

  const menuBar = user ? (
    <Menu 
      pointing 
      secondary 
      vertical 
      size="small" 
      color="primary" 
      className="menubar">
      <Menu.Item 
        className="menubar__item"
        name="start"
        active={activeItem === 'start'}
        onClick={handleItemClick}
        as={Link}
        to="/"
      />
      <Menu.Item 
        className="menubar__item"
        name="erstellen"
        active={activeItem === 'erstellen'}
        onClick={handleItemClick}
        as={Link}
        to="/create"
      />
        <Menu.Item 
          name={user.username} 
          className="menubar__item" 
        />
        <Menu.Item 
          name="Abmelden" 
          onClick={logout} 
          className="menubar__item" 
        />
    </Menu>
  ) : (
    <Menu 
      pointing 
      secondary 
      vertical 
      size="small" 
      color="primary" 
      className="menubar">
      <Menu.Item 
        className="menubar__item"
        name="start"
        active={activeItem === 'start'}
        onClick={handleItemClick}
        as={Link}
        to="/"
      />
        <Menu.Item 
        className="menubar__item"
          name="anmelden"
          active={activeItem === 'anmelden'}
          onClick={handleItemClick}
          as={Link}
          to="/login"
        />
        <Menu.Item 
          className="menubar__item"
          name="registrieren"
          active={activeItem === 'registrieren'}
          onClick={handleItemClick}
          as={Link}
          to="/register"
        />
    </Menu>
  );

  return menuBar;
}

export default MenuBar;
