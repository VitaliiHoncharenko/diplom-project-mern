import React, { useCallback, useContext, useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useHttp } from '../../hooks/http.hook';
import { useMessage } from '../../hooks/message.hook';
import { Loader } from '../../components/Loader';
import { NavLink } from 'react-router-dom';
import { List } from './List';

export const ExpensesPage = () => {
  const { token } = useContext(AuthContext);
  const { request, loading } = useHttp();
  const [expenses, setExpenses] = useState([]);
  const [visibleExpenses, setVisibleExpenses] = useState([]);
  const [userNames, setUserNames] = useState([]);
  const [currentName, setCurrentName] = useState('all');

  const message = useMessage();

  const getExpensesList = useCallback(async () => {
    try {
      const fetched = await request('/api/expense/list', 'GET', null, {
        Authorization: `Bearer ${token}`
      });

      setExpenses([...fetched]);

    } catch (e) {
      message(e.message, 'error');
    }
  }, [token, request]);

  const getUsers = useCallback(async () => {
    try {
      const fetched = await request('/api/users', 'GET', null, {
        Authorization: `Bearer ${token}`
      });

      const userNamesList = fetched.map((user) => {
        return user.name;
      });

      setUserNames([...userNamesList]);

    } catch (e) {
      message(e.message, 'error');
    }
  }, [token, request]);

  useEffect(() => {
    getExpensesList();
  }, [getExpensesList]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    if (expenses.length <= 0) {
      return;
    }

    if (currentName === 'all') {
      setVisibleExpenses([...expenses]);
      return;
    }

    const expensesByName = expenses.filter((expense) => {
      return expense.borrowers.some((item) => item.name === currentName)
    });

    setVisibleExpenses([...expensesByName]);


  }, [expenses, currentName]);

  const getCurrentExpenses = (event) => {
    setCurrentName(event.target.value)
  };

  if (loading) {
    return <Loader/>;
  }

  return (
    <div className="expenses-page">
      <div className="expenses-page__brief">
        <div className="expenses-page__journey-title">Название поездки</div>
        <div className="expenses-page__journey-date">Создана: <span>4 декабря 2020</span></div>
        <div>Сколько должны: 2566</div>
      </div>
      <div className="expenses-page__header">
        <div className="expenses-page__select-box">
          <select onChange={getCurrentExpenses}>
            <option defaultValue value="all">Все расходы</option>
            {
              userNames.map((name, idx) => {
                return (
                  <option key={idx} value={name}>Расходы {name}</option>
                )
              })
            }
          </select>
        </div>
        <div className="expenses-page__add-expense">
          <NavLink
            className="btn btn--text"
            to="/expense/create"
          >
            <span>+</span>
          </NavLink>
        </div>
      </div>
      <div className="expenses-page__body">
        <List
          visibleExpenses={visibleExpenses}
        />
      </div>
    </div>
  );
};
