import React from 'react';
import ReactDOM from 'react-dom';
import Menu from 'components/Menu';
import 'css/bootstrap.min.css';

const navItems = [
  {
    name: 'Home',
    isActive: true,
    href: '/',
  },
  {
    name: 'Login',
    isActive: false,
    href: '/login.html',
  },
  {
    name: 'Register',
    isActive: false,
    href: '/register.html',
  },
];

const navItemsUser = [
  {
    name: 'Home',
    isActive: true,
    href: '/',
  },
  {
    name: 'Logout',
    isActive: false,
    href: '/logout',
  }
]

fetch('/activeUser')
  .then(response => response.json())
  .then((data) => {
    if (!data){
      ReactDOM.render(<Menu items={navItems} />, document.getElementById('menu'));
    } else {
      ReactDOM.render(<Menu items={navItemsUser} />, document.getElementById('menu'));
    }
  });

