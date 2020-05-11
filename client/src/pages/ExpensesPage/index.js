import React, { useCallback, useContext, useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useHttp } from '../../hooks/http.hook';
import { useMessage } from '../../hooks/message.hook';
import { Loader } from '../../components/Loader';
import { NavLink, useHistory } from 'react-router-dom';
import { List } from './List';
import { formatDate, formatMoney } from '../../helpers';

export const ExpensesPage = () => {
  const { token, logout } = useContext(AuthContext);
  const { request, loading } = useHttp();
  const [expenses, setExpenses] = useState([]);
  const [visibleExpenses, setVisibleExpenses] = useState([]);
  const [userNames, setUserNames] = useState([]);
  const [currentName, setCurrentName] = useState('all');
  const [journey, setJourney] = useState({});
  const [totalDebt, setTotalDebt] = useState(0);

  const message = useMessage();
  const history = useHistory();

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

  const getJourney = useCallback(async () => {
    try {
      const fetched = await request('/api/journey', 'GET', null, {
        Authorization: `Bearer ${token}`
      });

      if (fetched === null) {
        history.push(`/journey`)
      }

      setJourney({ ...fetched });

    } catch (e) {
      message(e.message, 'error');
    }
  }, [token, request]);

  useEffect(() => {
    getJourney();
  }, [getJourney]);

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

    const visibleExpenses = expenses.filter((expense) => {
      return expense.borrowers.length > 0;
    });

    if (currentName === 'all') {
      setVisibleExpenses([...visibleExpenses]);
      return;
    }

    const expensesByName = visibleExpenses.filter((expense) => {
      return expense.borrowers.some((item) => item.name === currentName);
    });

    setVisibleExpenses([...expensesByName]);


  }, [expenses, currentName]);

  useEffect(() => {
    if (expenses.length <= 0) {
      return;
    }

    const currentUserDebt = (user) => {
      return user.name === currentName ? user.sum : 0;
    };

    const totalDebt = expenses.reduce((total, current) => {
      return total + current.borrowers.reduce((totalDebt, currentDebt) => {
        return totalDebt + (currentName === 'all' ? currentDebt.sum : currentUserDebt(currentDebt));
      }, 0);
    }, 0);

    setTotalDebt(totalDebt);

  }, [expenses, currentName]);

  const getCurrentExpenses = (event) => {
    setCurrentName(event.target.value);
  };

  const logoutHandler = event => {
    event.preventDefault();
    logout();
    history.push('/');
  };

  if (loading) {
    return <Loader/>;
  }

  return (
    <div className="expenses-page">
      <div className="header">
        <div className="header__title">Список оплат</div>
        <a className="header__btn-exit"
           href="/"
           onClick={logoutHandler}
        >
          <span>Выйти</span>
        </a>
      </div>
      <div className="expenses-page__brief">
        <div className="expenses-page__journey-title">{journey.title}</div>
        <div className="expenses-page__expense-info">
          <div className="expenses-page__journey-date">
            <span className="date" dangerouslySetInnerHTML={{ __html: formatDate(journey.createdAt) }}/>
          </div>
          <span className="expenses-page__separator">•</span>
          <div className="expenses-page__users-qty">
            <span>{userNames.length} чел</span>
          </div>
        </div>
        {totalDebt > 0 && <div className="expenses-page__summary-debt">
          {`Сумма долга (${currentName === 'all' ? 'общая' : currentName}):`}<span>{formatMoney(totalDebt)}</span>
        </div> }
      </div>
      <div className="expenses-page__header">
        <div className="expenses-page__select-box">
          <select onChange={getCurrentExpenses}>
            <option defaultValue value="all">Все расходы</option>
            {
              userNames.map((name, idx) => {
                return (
                  <option key={idx} value={name}>Расходы {name}</option>
                );
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
        {visibleExpenses.length > 0 && <List
          visibleExpenses={visibleExpenses}
          currentName={currentName}
        />}

        {visibleExpenses.length === 0 && <div className="expenses-page__empty-list">
          <div className="expenses-page__empty-info">
            <div className="expenses-page__empty-notice">
              <p>Здесь отображается <br/>список ваших оплат.</p>
              <p>Для создания новой оплаты, <br/>нажмите на <span>+</span></p>
            </div>
            <div className="expenses-page__angle-arrow">↴</div>
          </div>

        </div>}
      </div>
    </div>
  );
};
