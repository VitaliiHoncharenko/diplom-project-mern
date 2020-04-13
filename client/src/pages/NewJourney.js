import React, { useContext, useState } from 'react';
import { useHttp } from '../hooks/http.hook';
import { AuthContext } from '../context/AuthContext';
import { useMessage } from "../hooks/message.hook";
import { useHistory } from "react-router-dom";

export const NewJourney = () => {
  const [title, setTitle] = useState('');
  const { request } = useHttp();
  const { token } = useContext(AuthContext);
  const message = useMessage();
  const history = useHistory();

  const onHandler = async event => {
    try {
      const data = await request('/api/journey/create', 'POST', { title }, {
        Authorization: `Bearer ${token}`
      });

      history.push(`/new-expense-details`)
      message(data.message);
    } catch (e) {
      message(e.message, 'error');
    }
  };

  return (
    <div className="journey-create">
      <form className="form journey-create__form" noValidate>
        <h1 className="form__title">Создание поездки</h1>
        <div className="form__group">
          <div className="form__row">
            <input
              placeholder=" "
              className="form__input"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <label className="form__label">
              Введите название поездки
            </label>
          </div>
        </div>
        <a href="#" className="form__btn" onClick={onHandler}>Сохранить</a>
      </form>
    </div>
  );
};
