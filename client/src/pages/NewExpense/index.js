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

export const NewExpense = () => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [users, setUsers] = useState([]);
  const [author, setAuthor] = useState('');
  const [modalIsOpen, setIsOpen] = useState(false);

  const [payersStatus, setPayersStatus] = useState('');
  const [payers, setPayers] = useState([]);
  const [lendersQty, setLendersQty] = useState(0);

  const [isSinglePayer, setSinglePayer] = useState(true);

  const { request, loading } = useHttp();
  const { token, userId } = useContext(AuthContext);
  const message = useMessage();

  const openModal = (e) => {
    e.preventDefault();
    setIsOpen(true);
  };

  const closeModal = (e) => {
    e.preventDefault();
    setIsOpen(false);
    setSinglePayer(true)
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
    const authorData = users.find((user) => {
      return user._id === userId;
    });

    if (authorData) {
      setAuthor(authorData.name);
      setPayersStatus(authorData.name);
    }

  }, [users]);

  useEffect(() => {
    const payersList = users.map((user) => {
      return {
        name: user.name,
        isPayer: user.name === author,
      }
    });

    setPayers([...payersList]);
  }, [users, author]);

  useEffect(() => {
    if (payers.length <= 0) {
      return;
    }

    const foundPayers = payers.filter((payer) => {
      return payer.isPayer;
    });

    if (foundPayers.length <= 0) {
      return;
    }

    const payerStatus = () => {
      if (foundPayers.length > 1 ) {
        return `${foundPayers.length} чел.`;
      }

      if (foundPayers[0].name === author) {
        return `${foundPayers[0].name}(Вы)`
      }

      return foundPayers[0].name;
    };

    setPayersStatus(payerStatus());
    setLendersQty(foundPayers.length);

  }, [payers]);

  if (loading) {
    return <Loader/>;
  }

  return (
    <div className="expense-create">
      <form className="expense-create__form form">
        <div className="form__title">Укажите название и сумму новой оплаты:</div>

        <ExpenseFormInput
          title={title}
          amount={amount}
          onChangeTitle={e => setTitle(e.target.value)}
          onChangeAmount={e => setAmount(e.target.value)}
        />

        <ExpensePayersControl
          openModal={openModal}
          payersStatus={payersStatus}
        />

        <ExpenseHandler
          payers={payers}
          title={title}
          amount={amount}
          users={users}
        />

        <Modal
          onOpen={e => openModal(e)}
          onClose={e => closeModal(e)}
          isOpen={modalIsOpen}
        >
          <ExpenseDetails
            payers={payers}
            isSinglePayer={isSinglePayer}
            lendersQty={lendersQty}
            setSinglePayer={setSinglePayer}
            setPayers={setPayers}
            closeModal={closeModal}
          />
        </Modal>
      </form>
    </div>
  );
};
