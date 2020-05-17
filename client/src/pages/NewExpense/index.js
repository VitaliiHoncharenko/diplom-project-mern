import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHttp } from '../../hooks/http.hook';
import { AuthContext } from '../../context/AuthContext';
import { useMessage } from '../../hooks/message.hook';
import { Loader } from "../../components/Loader";
import { Modal } from '../../components/Modal';
import { NewExpenseForm } from './NewExpenseForm';
import { NewExpenseControls } from './NewExpenseControls';
import { NewExpenseHandlerData } from './NewExpenseHandlerData';
import { NewExpenseEqual } from './NewExpenseEqual';
import { NewExpenseUnequal } from './NewExpenseUnequal';
import { NavLink } from "react-router-dom";

export const NewExpense = () => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [users, setUsers] = useState([]);
  const [author, setAuthor] = useState('');

  const [isEqualPayersModalOpen, setIsEqualPayersModalOpen] = useState(false);
  const [isUnequalPayersModalOpen, setIsUnequalPayersModalOpen] = useState(false);

  const [payers, setPayers] = useState([]);
  // const [lendersQty, setLendersQty] = useState(0);
  const [payersAmount, setPayersAmount] = useState({});
  const [notPayers, setNotPayers] = useState({});

  // const [isSinglePayer, setSinglePayer] = useState(true);

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
        sum: 0,
      };
    });

    setPayers([...payersList]);
  }, [users, author]);

  // useEffect(() => {
  //   if (payers.length <= 0) {
  //     return;
  //   }
  //
  //   const foundPayers = payers.filter((payer) => {
  //     return payer.isLender;
  //   });
  //
  //   if (foundPayers.length <= 0) {
  //     return;
  //   }
  //
  //   setLendersQty(foundPayers.length);
  //
  // }, [payers, notPayers]);

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
    <div className="new-expense">
      <div className="header">
        <NavLink
          className="header__btn-back"
          to="/expense/list"
        >
          <span>❮</span>
        </NavLink>
        <div className="header__title">
          Выберите плательщика
        </div>
      </div>
      <form className="new-expense__form form">
        <div className="form__title">Укажите название и сумму новой оплаты:</div>
        <NewExpenseForm
          title={title}
          amount={amount}
          onChangeTitle={e => setTitle(e.target.value)}
          onChangeAmount={e => setAmount(e.target.value)}
        />

        <NewExpenseControls
          openEqualPayersModal={openEqualPayersModal}
          openUnequalPayersModal={openUnequalPayersModal}
        />

        <NewExpenseHandlerData
          payers={payers}
          title={title}
          amount={amount}
        />
      </form>

      <Modal
        onOpen={openEqualPayersModal}
        onClose={closeEqualPayersModal}
        isOpen={isEqualPayersModalOpen}
      >
        <NewExpenseUnequal
          amount={amount}
          payers={payers}
          setPayers={setPayers}
          closeModal={closeEqualPayersModal}
        />
      </Modal>

      <Modal
        onOpen={openUnequalPayersModal}
        onClose={closeUnequalPayersModal}
        isOpen={isUnequalPayersModalOpen}
      >
        <NewExpenseEqual
          payers={payers}
          notPayers={notPayers}
          amount={amount}
          payersAmount={payersAmount}
          setPayers={setPayers}
          setNotPayers={setNotPayers}
          setPayersAmount={setPayersAmount}
          closeModal={closeUnequalPayersModal}
        />
      </Modal>
    </div>
  );
};
