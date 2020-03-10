import React, { useContext, useState } from 'react'
import { useHttp } from '../hooks/http.hook'
import { AuthContext } from '../context/AuthContext'
import { useMessage } from '../hooks/message.hook'

export const NewExpense = () => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const {loading, request} = useHttp();
  const {token} = useContext(AuthContext)
  const {message} = useMessage();

  const onHandler = async event => {
    try {
      const data = await request('/api/expense/create', 'POST', { title, amount }, {
        Authorization: `Bearer ${token}`
      });

    } catch (e) {}
  };

  return (
    <div>
      <h1>Укажите название и сумму новой оплаты:</h1>
      <div className="input-field">
        <input
          placeholder="Введите название оплаты"
          id="link"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>
      <div className="input-field">
        <input
          placeholder="Введите сумму оплаты"
          id="link"
          type="text"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
      </div>
      <a href="#" className="btn-large" onClick={onHandler}>Сохранить</a>
    </div>
  )
}
