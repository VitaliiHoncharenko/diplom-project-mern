import React, { useCallback, useContext, useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { useHttp } from '../../hooks/http.hook';
import { AuthContext } from '../../context/AuthContext';
import { Loader } from '../../components/Loader';
import { List } from './list';
import { formatDate } from "../../helpers";
import { Modal } from "../../components/Modal";
import { SettleUp } from './SettleUp'

export const ExpenseDetails = () => {
  const { token } = useContext(AuthContext);
  const { request, loading } = useHttp();
  const expenseId = useParams().id;
  const history = useHistory();

  const [expense, setExpense] = useState(null);
  const [borrowers, setBorrowers] = useState([]);
  const [lenders, setLenders] = useState([]);

  const [currentRepay, setCurrentRepay] = useState(null);

  const [isPaybackModal, setIsPaybackModal] = useState(false);

  const getExpense = useCallback(async () => {
    try {
      const fetched = await request(`/api/expense/${expenseId}`, 'GET', null, {
        Authorization: `Bearer ${token}`
      });

      if (fetched.borrowers.length === 0) {
        history.push('/expense/list');
        return;
      }

      setExpense(fetched);
    } catch (e) {
      history.push('/expense/list');
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

  const openPaybackModal = (event) => {
    event.preventDefault();

    setIsPaybackModal(true);
  };

  const closePaybackModal = (event) => {
    event.preventDefault();

    setIsPaybackModal(false);
  };

  const checkExpense = () => {
    if (borrowers.length !== 0) {
      return;
    }

    history.push('/expense/list');
  };

  if (loading) {
    return <Loader/>;
  }

  return expense && (
    <div className="expense-details">
      <div className="header">
        <NavLink className="header__btn-back"
                 to="/expense/list">
          <span>❮</span>
        </NavLink>
        <div className="header__title">
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
            <Tab className="expense-details__tab">Недоплатили</Tab>
            <Tab className="expense-details__tab">Переплатили</Tab>
          </TabList>

          <TabPanel className="expense-details__tab-content">
            <List
              items={borrowers}
              lenders={lenders}
              onOpenModal={openPaybackModal}
              setCurrentRepay={setCurrentRepay}
            />
          </TabPanel>
          <TabPanel className="expense-details__tab-content">
            <List
              items={lenders}
              borrowers={borrowers}
              onOpenModal={openPaybackModal}
              setCurrentRepay={setCurrentRepay}
            />
          </TabPanel>
        </Tabs>
      </div>

      <Modal
        onOpen={openPaybackModal}
        onClose={closePaybackModal}
        onAfterCloseModal={checkExpense}
        isOpen={isPaybackModal}
      >
        <SettleUp
          expense={expense}
          borrowers={borrowers}
          lenders={lenders}
          setBorrowers={setBorrowers}
          setLenders={setLenders}
          currentRepay={currentRepay}
          onCloseModal={closePaybackModal}
        />
      </Modal>
    </div>
  );
};
