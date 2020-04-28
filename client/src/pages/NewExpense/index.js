import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHttp } from '../../hooks/http.hook';
import { AuthContext } from '../../context/AuthContext';
import { useMessage } from '../../hooks/message.hook';
import { Loader } from "../../components/Loader";
import { Modal } from '../../components/Modal';
import { ExpenseDetails } from './ExpenseDetails';
import { ExpenseFormInput } from './ExpenseFormInput';
import { ExpensePayersControl } from './ExpensePayersControl';
import { ExpenseHandler } from './ExpenseHandler';
import { ExpenseFill } from './ExpenseFill';
import { NavLink } from "react-router-dom";

export const NewExpense = () => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [users, setUsers] = useState([]);
  const [author, setAuthor] = useState('');

  const [isEqualPayersModalOpen, setIsEqualPayersModalOpen] = useState(false);
  const [isUnequalPayersModalOpen, setIsUnequalPayersModalOpen] = useState(false);

  const [payers, setPayers] = useState([]);
  const [payersStatus, setPayersStatus] = useState('');
  const [splitStatus, setSplitStatus] = useState('Поровну');
  const [lendersQty, setLendersQty] = useState(0);
  const [payersAmount, setPayersAmount] = useState({});
  const [notPayers, setNotPayers] = useState({});

  const [isSinglePayer, setSinglePayer] = useState(true);

  const { request, loading } = useHttp();
  const { token, userId } = useContext(AuthContext);
  const message = useMessage();

  const openEqualPayersModal = (e) => {
    e.preventDefault();
    if (amount <= 0) {
      message('Введите сумму оплаты', 'info');
      return;
    }

    setIsEqualPayersModalOpen(true);
  };

  const openUnequalPayersModal = (e) => {
    e.preventDefault();
    if (amount <= 0) {
      message('Введите сумму оплаты', 'info');
      return;
    }

    setIsUnequalPayersModalOpen(true);
  };

  const closeEqualPayersModal = (e) => {
    e.preventDefault();
    setIsEqualPayersModalOpen(false);
  };

  const closeUnequalPayersModal = (e) => {
    e.preventDefault();
    setIsUnequalPayersModalOpen(false);
  };

  const getUsers = useCallback(async () => {
    try {
      const fetched = await request('/api/users', 'GET', null, {
        Authorization: `Bearer ${token}`
      });

      setUsers(fetched);
    } catch (e) {
      message(e.message, 'error');
    }
  }, [token, request]);

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (users.length <= 0) {
      return;
    }

    const authorData = users.find((user) => {
      return user._id === userId;
    });

    if (authorData) {
      setAuthor(authorData.name);
      setPayersStatus(authorData.name);
    }

  }, [users]);


  useEffect(() => {
    if (users.length <= 0) {
      return;
    }

    const getNames = users.reduce((acc, user) => {
      acc = {...acc, [user.name]: false};
      return acc;
    }, {});

    setNotPayers({...getNames})
  }, [users]);

  useEffect(() => {
    const payersList = users.map((user) => {
      return {
        name: user.name,
        isLender: user.name === author,
      };
    });

    setPayers([...payersList]);
  }, [users, author]);

  useEffect(() => {
    if (payers.length <= 0) {
      return;
    }

    const foundPayers = payers.filter((payer) => {
      return payer.isLender;
    });

    if (foundPayers.length <= 0) {
      return;
    }

    const payerStatus = () => {
      if (foundPayers.length > 1) {
        return `${foundPayers.length} чел.`;
      }

      if (foundPayers[0].name === author) {
        return `${foundPayers[0].name}(Вы)`;
      }

      return foundPayers[0].name;
    };

    setPayersStatus(payerStatus());
    setLendersQty(foundPayers.length);

  }, [payers]);

  const calculateSumPerPayer = (payersList) => {
    const splitAmount = +amount / payers.length;

    const splitPayers = (group, payer) => {
      const type = payer.isLender === true ? 'lenders' : 'borrowers';

      group[type] = [...group[type], payer];

      return group;
    };

    const { lenders, borrowers } = payersList.reduce(splitPayers, {
      lenders: [],
      borrowers: [],
    });

    const lendAmount = Math.round((splitAmount * borrowers.length / lenders.length) * 100) / 100;
    const debtAmount = Math.round((lendAmount * lenders.length / borrowers.length) * 100) / 100;

    return payersList.map(({ name, isLender }) => {
      const isNeedToPay = isLender && splitAmount <= lendAmount;

      return {
        name,
        isLender: isNeedToPay,
        sum: isNeedToPay ? lendAmount : debtAmount,
      };
    });
  };

  useEffect(() => {
    setPayers([...calculateSumPerPayer(payers)]);
  }, [amount]);

  if (loading) {
    return <Loader/>;
  }

  return (
    <div className="expense-create">
      <div className="expense-create__header">
        <div className="expense-create__back-btn">
          <NavLink to="/expense/list">
            <span>❮</span>
          </NavLink>
        </div>
        <div className="expense-payers__title">
          Выберите плательщика
        </div>
      </div>
      <form className="expense-create__form form">
        <div className="form__title">Укажите название и сумму новой оплаты:</div>
        <ExpenseFormInput
          title={title}
          amount={amount}
          onChangeTitle={e => setTitle(e.target.value)}
          onChangeAmount={e => setAmount(e.target.value)}
        />

        <ExpensePayersControl
          openEqualPayersModal={openEqualPayersModal}
          openUnequalPayersModal={openUnequalPayersModal}
          payersStatus={payersStatus}
          splitStatus={splitStatus}
        />

        <ExpenseHandler
          payers={payers}
          title={title}
          amount={amount}
        />
      </form>

      <Modal
        onOpen={openEqualPayersModal}
        onClose={closeEqualPayersModal}
        isOpen={isEqualPayersModalOpen}
        onAfterCloseModal={() => setSinglePayer(true)}
      >
        <ExpenseDetails
          payers={payers}
          amount={amount}
          isSinglePayer={isSinglePayer}
          lendersQty={lendersQty}
          setSinglePayer={setSinglePayer}
          setPayers={setPayers}
          closeModal={closeEqualPayersModal}
        />
      </Modal>

      <Modal
        onOpen={openUnequalPayersModal}
        onClose={closeUnequalPayersModal}
        isOpen={isUnequalPayersModalOpen}
      >
        <ExpenseFill
          payers={payers}
          amount={amount}
          setPayers={setPayers}
          notPayers={notPayers}
          setNotPayers={setNotPayers}
          closeModal={closeUnequalPayersModal}
          setSplitStatus={setSplitStatus}
          payersAmount={payersAmount}
          setPayersAmount={setPayersAmount}
        />
      </Modal>
    </div>
  );
};
