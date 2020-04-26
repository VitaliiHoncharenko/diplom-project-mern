import React, { useContext, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const Navbar = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const [isShow, setIsShow] = useState(false);

  const logoutHandler = event => {
    event.preventDefault();
    auth.logout();
    history.push('/');
  };

  return (
    <nav>
      <button onClick={() => setIsShow(!isShow)}>Close</button>
      {isShow && <div>
        <span className="brand-logo">I OWE YOU</span>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          <li><NavLink to="/name">Добавить имя</NavLink></li>
          <li><NavLink to="/journey">Создать поездку</NavLink></li>
          <li><NavLink to="/expense">Создать оплату</NavLink></li>
          <li><NavLink to="/expense/list">Список оплат</NavLink></li>
          <li><NavLink to="/journey/details">Создать детали поездки</NavLink></li>
          <li><a href="/" onClick={logoutHandler}>Выйти</a></li>
        </ul>
      </div>}
    </nav>
  );
};
