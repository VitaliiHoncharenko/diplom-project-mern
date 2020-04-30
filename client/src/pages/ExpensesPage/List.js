import React from 'react';
import { formatDate, formatMoney } from "../../helpers";
import { NavLink, useHistory } from 'react-router-dom';

export const List = ({ visibleExpenses, currentName }) => {


  const getSum = (borrowers) => {
    return borrowers.reduce((sum, current) => {
      if (currentName === 'all') {
        return sum + current.sum;
      }

      if (current.name === currentName) {
        return sum + current.sum;
      }

      return sum;
    }, 0);
  };

  return (
    <ul className="expenses-page__list">
      {
        visibleExpenses.map((expense) => {
          return (
            <li key={expense._id} className="expenses-page__list-item">
              <NavLink to={`/expense/${expense._id}`} className="expenses-page__item-content">
                <div className="expenses-page__item-time"
                     dangerouslySetInnerHTML={{ __html: formatDate(expense.createdAt, 'dm') }}
                />
                <div className="expenses-page__item-info">
                  <div className="expenses-page__info-top">
                    <div className="expenses-page__item-title"><span>{expense.title}</span></div>
                    <div className="expenses-page__item-amount">Долг: {formatMoney(getSum(expense.borrowers))}</div>
                  </div>
                  <div className="expenses-page__info-bottom">
                    Сумма оплаты: {formatMoney(expense.amount)}
                  </div>
                </div>
                <div className="expenses-page__item-open">
                  ❯
                </div>
              </NavLink>
            </li>
          );
        })
      }
    </ul>
  );
};