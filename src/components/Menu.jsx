import React, { Component } from 'react';

export default class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: this.props.items,
      user: this.props.user,
    };
  }

  render() {
    const items = this.state.items.map((item) => {
      return (
        <NavItem active={item.isActive} name={item.name} href={item.href} />
      );
    });
    return (
      <ul className="nav nav-pills">
        {items}
        <Userinfo href="/" username={this.state.user} />
      </ul>
    );
  }
}

function NavItem(props) {
  return (
    <li className="nav-item">
      <a className={props.active ? 'nav-link active disabled' : 'nav-link'} href={props.href}>{props.name}</a>
    </li>
  );
}

function Userinfo(props) {
  return (
    <li className="nav-item">
      <a className="nav-link disabled" href={props.href}>{props.username}</a>
    </li>
  );
}
