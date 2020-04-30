import React, { useCallback, useContext, useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { useHttp } from '../../hooks/http.hook';
import { AuthContext } from '../../context/AuthContext';
import { Loader } from '../../components/Loader';
import { List } from './list';
import { formatDate } from "../../helpers";


export const ExpenseDetails = () => {
  const { token } = useContext(AuthContext);
  const { request, loading } = useHttp();
  const expenseId = useParams().id;
  const history = useHistory();

  const [expense, setExpense] = useState(null);
  const [borrowers, setBorrowers] = useState([]);
  const [lenders, setLenders] = useState([]);

  const getExpense = useCallback(async () => {
    try {
      const fetched = await request(`/api/expense/${expenseId}`, 'GET', null, {
        Authorization: `Bearer ${token}`
      });

      setExpense(fetched);
    } catch (e) {
      history.push(`/expense/list`);
    }
  }, [token, expenseId, request]);

  useEffect(() => {
    getExpense();
  }, [getExpense]);

  useEffect(() => {
    if (expense === null) {
      return;
    }

    setBorrowers([...expense.borrowers]);
    setLenders([...expense.lenders]);

  }, [expense]);

  if (loading) {
    return <Loader/>;
  }

  return expense && (
    <div className="expense-details">
      <div className="expense-details__header">
        <div className="expense-details__back-btn">
          <NavLink to="/expense/list">
            <span>❮</span>
          </NavLink>
        </div>
        <div className="expense-details__title">
          Детали оплаты
        </div>
      </div>
      <div className="expense-details__brief">
        <div className="expense-details__expense-title">
          {expense.title}
        </div>
        <div className="expense-details__expense-amount">
          Стоимость: <span>{expense.amount}</span>
        </div>
        <div className="expense-details__expense-date">
          Дата создания: <span dangerouslySetInnerHTML={{ __html: formatDate(expense.createdAt) }}/>
        </div>
      </div>
      <div className="expense-details__content">
        <Tabs className="expense-details__tabs">
          <TabList className="expense-details__tabs-list">
            <Tab className="expense-details__tab">Заемщики</Tab>
            <Tab className="expense-details__tab">Кредиторы</Tab>
          </TabList>

          <TabPanel className="expense-details__tab-content">
            <List
              items={borrowers}
              lenders={lenders}
            />
          </TabPanel>
          <TabPanel className="expense-details__tab-content">
            <List
              items={lenders}
              borrowers={borrowers}
            />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};