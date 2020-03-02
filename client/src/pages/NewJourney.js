import React, { useContext, useState } from 'react';
import { useHttp } from '../hooks/http.hook';
import { AuthContext } from '../context/AuthContext';
import { useMessage } from '../hooks/message.hook';
import { useHistory } from "react-router-dom";

export const NewJourney = () => {
  const [title, setTitle] = useState('');
  const { request } = useHttp();
  const { token } = useContext(AuthContext);
  const { message } = useMessage();
  const history = useHistory();

  const onHandler = async event => {
    try {
      const data = await request('/api/journey/create', 'POST', { title }, {
        Authorization: `Bearer ${token}`
      });

      // history.push(`/new-expense-details`)
    } catch (e) {
      console.log('!!!!!!')
    }
  };

  return (
    <div>
      <h1>Введите название Вашей поездки:</h1>
      <div className="input-field">
        <input
          placeholder="Введите название поездки"
          id="link"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>
      <a href="#" className="btn-large" onClick={onHandler}>Сохранить</a>
    </div>
  );
};
