import React, { useContext, useState } from 'react';
import { useHttp } from '../hooks/http.hook';
import { AuthContext } from '../context/AuthContext';
import { useMessage } from '../hooks/message.hook';
import { useHistory } from "react-router-dom";

export const AddName = () => {
  const [name, setName] = useState('');
  const { loading, request } = useHttp();
  const { token } = useContext(AuthContext);
  const { message } = useMessage();
  const history = useHistory();

  const onHandler = async event => {
    try {
      const data = await request('/api/auth/name/update', 'POST', { name }, {
        Authorization: `Bearer ${token}`
      });

      // history.push(`/new-expense-details`)
    } catch (e) {
    }
  };

  return (
    <div>
      <h1>Введите Ваше имя</h1>
      <div className="input-field">
        <input
          placeholder="Введите имя"
          id="link"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>
      <a href="#" className="btn-large" onClick={onHandler}>Сохранить</a>
    </div>
  );
};
