import React, { useContext, useState } from 'react'
import { useHttp } from '../hooks/http.hook'
import { AuthContext } from '../context/AuthContext'
import { useMessage } from '../hooks/message.hook'

export const NewExpense = () => {
  const [expense, setExpense] = useState([]);
  const {loading, request} = useHttp();
  const {token} = useContext(AuthContext)
  const {message} = useMessage();

  const onHandler = async event => {
    try {
      const data = await request('/api/expense/create', 'POST', { expense }, {
        Authorization: `Bearer ${token}`
      });

    } catch (e) {}
  };

  return (
    <div>
      <h1>Введите название новой оплаты:</h1>
      <div className="input-field">
        <input
          placeholder="Введите название оплаты"
          id="link"
          type="text"
          value={expense}
          onChange={e => setExpense(e.target.value)}
        />
      </div>
      <a href="#" className="btn-large" onClick={onHandler}>Сохранить</a>
    </div>
  )
}
