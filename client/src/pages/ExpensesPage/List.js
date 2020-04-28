import React from 'react';
import { formatDate, formatMoney } from "../../helpers";

export const List = ({visibleExpenses}) => {
  const getSum = (borrowers) => {
    return borrowers.reduce((sum, current) => {
      return sum + current.sum;
    }, 0);
  };

  return (
    <ul className="expenses-page__list">
      {
        visibleExpenses.map((expense) => {
          return (
            <li key={expense._id} className="expenses-page__list-item">
              <a href="#" className="expenses-page__item-content">
                <div className="expenses-page__item-time"
                     dangerouslySetInnerHTML={{ __html: formatDate(expense.createdAt, 'dm') }}
                />
                <div className="expenses-page__item-info">
                  <div className="expenses-page__info-top">
                    <div className="expenses-page__item-title"><span>{expense.title}</span></div>
                    <div className="expenses-page__item-amount">{formatMoney(expense.amount)} </div>
                  </div>
                  <div className="expenses-page__info-bottom">
                    Сумма долга: {formatMoney(getSum(expense.borrowers))}
                  </div>
                </div>
                <div className="expenses-page__item-open">
                  ❯
                </div>
              </a>
            </li>
          );
        })
      }
    </ul>
  );
};