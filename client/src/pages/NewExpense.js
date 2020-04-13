import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHttp } from '../hooks/http.hook';
import { AuthContext } from '../context/AuthContext';
// import { AuthorContext } from './context/AuthorContext';
import { useMessage } from '../hooks/message.hook';

export const NewExpense = () => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [users, setUsers] = useState([]);
  const [author, setAuthor] = useState('')
  const [borrowers, setBorrowers] = useState('');
  const [lenders, setLenders] = useState('');

  const { loading, request } = useHttp();
  const { token, userId } = useContext(AuthContext);
  const message = useMessage();

  const getUsers = useCallback(async () => {
    try {
      const fetched = await request('/api/users', 'GET', null, {
        Authorization: `Bearer ${token}`
      });

      setUsers(fetched);
    } catch (e) {
      message(e.message);
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
      setAuthor(authorData.name)
    }

  }, [users]);

  const onHandler = async event => {
    try {
      const data = await request(
        '/api/expense/create',
        'POST',
        {
          title,
          amount,
          borrowers: {
            name: 'borrower',
            sum: 100,
          },
          lenders: {
            name: 'lender',
            sum: 200,
          }
        },
        {
          Authorization: `Bearer ${token}`
         }
      );

      message(data.message);

    } catch (e) {
      message(e.message);
    }
  };

  return (
    <div className="expense-create">
      <form className="expense-create__form form">
        <div className="form__title" >Укажите название и сумму новой оплаты:</div>

        <div className="form__group">
          <div className="form__row">
            <input
              className="form__input"
              placeholder=" "
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <label className="form__label">
              Введите название оплаты
            </label>
          </div>
          <div className="form__row">
            <input
              className="form__input"
              placeholder=" "
              type="text"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
            <label className="form__label">
              Введите сумму оплаты
            </label>
          </div>
        </div>


        <div>
          <ul>
            {
            users.map((user) =>
              <li key={user._id}>
                {user.name}
              </li>
            )}
          </ul>


          Платил <span>{ author }</span> и разделить <span>Поровну </span>
        </div>

        <div className="form__btn-group">
          <a href="#" className="form__btn" onClick={onHandler}>Сохранить</a>
        </div>
      </form>
    </div>
  );
};
