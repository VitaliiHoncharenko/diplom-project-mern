import React, { useContext } from "react";
import { useHistory } from 'react-router-dom';
import { useHttp } from '../../hooks/http.hook';
import { useMessage } from '../../hooks/message.hook';
import { AuthContext } from '../../context/AuthContext';

export const ExpenseHandler = ({payers, title, amount, users}) => {
  const { request } = useHttp();
  const message = useMessage();
  const { token } = useContext(AuthContext);
  const history = useHistory();

  const onHandler = async () => {
    const expenseUsers = payers.reduce((payersGroup, {name, sum, isPayer}) => {
      const type = isPayer === true ? 'lenders' : 'borrowers';

      payersGroup[type] = [...payersGroup[type], {name, sum}];

      return payersGroup;
    }, {
      lenders: [],
      borrowers: [],
    });

    try {
      const data = await request(
        '/api/expense/create',
        'POST',
        {
          title,
          amount,
          ...expenseUsers,
        },
        {
          Authorization: `Bearer ${token}`
        }
      );


      history.push(`/expense/list`)
      message(data.message);


    } catch (e) {
      message(e.message, 'error');
    }
  };

  return (
    <div className="form__btn-group">
      <a href="#" className="form__btn" onClick={onHandler}>Сохранить</a>
    </div>
  );
};