import React, { useContext, useEffect, useState } from 'react';
import { useHttp } from '../hooks/http.hook';
import { AuthContext } from '../context/AuthContext';
import { useMessage } from '../hooks/message.hook';
import { useHistory } from "react-router-dom";

export const AddName = () => {
  const [name, setName] = useState('');
  const { loading, request} = useHttp();
  const { token } = useContext(AuthContext);
  const message = useMessage();
  const history = useHistory();

  const onHandler = async event => {
    try {
      const data = await request('/api/auth/name/update', 'POST', { name }, {
        Authorization: `Bearer ${token}`
      });

      message(data.message, 'info');

      history.push(`/journey`)
    } catch (e) {
      message(e.message, 'error');
    }
  };

  return (
    <div className="add-name">
      <form noValidate className="form add-name__form">
        <h1 className="form__title">Добавление имени</h1>

        <div className="form__group">
          <div className="form__row">
            <input
              className="form__input"
              placeholder=" "
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <label className="form__label">
              Введите имя
            </label>
          </div>
        </div>
        <a href="#" className="form__btn" onClick={onHandler}><span>Сохранить</span></a>
      </form>
    </div>
  );
};
