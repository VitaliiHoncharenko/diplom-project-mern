import React, { useContext } from "react";
import { useHttp } from '../../hooks/http.hook';
import { useMessage } from '../../hooks/message.hook';
import { AuthContext } from "../../context/AuthContext";

export const ExpenseHandler = ({payers, title, amount, users}) => {
  const { request } = useHttp();
  const message = useMessage();
  const { token } = useContext(AuthContext);


  const onHandler = async event => {
    let lenders = payers.filter((payer) => payer.isPayer);
    let borrowers = payers.filter((payer) => payer.isPayer === false);

    const isEven = lenders.length === users.length;

    const splitAmount = amount / users.length;

    const lendAmount = (isEven === false)
      ? Math.round((splitAmount * borrowers.length / lenders.length) * 100) / 100
      : null;
    const debtAmount = (isEven === false)
      ? Math.round((lendAmount * lenders.length / borrowers.length) * 100) / 100
      : null;

    const defineSum = (isLender) => {
      if (isLender) {
        return lendAmount;
      }

      return debtAmount;
    };

    const expenseUsers = payers.reduce((payersGroup, current) => {
      const type = current.isPayer === true ? 'lenders' : 'borrowers';
      const currentPayer = {
        [type] : {
          name: current.name,
          sum: isEven ? 0 : defineSum(current.isPayer),
        }
      };

      payersGroup[type] = [...payersGroup[type], currentPayer[type]];

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