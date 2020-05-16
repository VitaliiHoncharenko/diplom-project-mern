import React, { useContext } from "react";
import { useHistory } from 'react-router-dom';
import { useHttp } from '../../hooks/http.hook';
import { useMessage } from '../../hooks/message.hook';
import { AuthContext } from '../../context/AuthContext';

export const ExpenseHandler = ({payers, title, amount}) => {
  const { request } = useHttp();
  const message = useMessage();
  const { token } = useContext(AuthContext);
  const history = useHistory();

  const onHandler = async () => {
    const expenseUsers = payers.reduce((payersGroup, {name, sum, isLender, personalLender}) => {
      const type = isLender === true ? 'lenders' : 'borrowers';

      if (sum === 0) {
        return payersGroup;
      }

      payersGroup[type] = [...payersGroup[type], {name, sum, to: (isLender ? null : personalLender)}];

      return payersGroup;
    }, {
      lenders: [],
      borrowers: [],
    });

    const filterExpense = () => {
      if (expenseUsers.lenders.length === 0 || expenseUsers.borrowers.length === 0) {
        return {
          lenders: [],
          borrowers: [],
        }
      }

      return expenseUsers;
    };

    try {
      const data = await request(
        '/api/expense/create',
        'POST',
        {
          title,
          amount,
          ...filterExpense(),
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
