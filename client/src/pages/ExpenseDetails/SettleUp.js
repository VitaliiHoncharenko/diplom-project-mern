import React, { useContext, useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useHttp } from '../../hooks/http.hook';
import { useMessage } from '../../hooks/message.hook';
import { AuthContext } from '../../context/AuthContext';

export const SettleUp = ({ borrowers, lenders, setBorrowers, setLenders, currentRepay, onCloseModal }) => {
  const { request, loading } = useHttp();
  const { token } = useContext(AuthContext);
  const message = useMessage();
  const settleUpInput = useRef(null);

  const history = useHistory();
  const expenseId = useParams().id;
  const [borrower, setBorrower] = useState({});
  const [lender, setLender] = useState({});

  useEffect(() => {
    if ((currentRepay) === null) {
      return;
    }

    setBorrower(currentRepay.currentBorrower);
    setLender(currentRepay.currentLender);
  }, [currentRepay]);

  useEffect(() => {
    if (borrower.sum === undefined) {
      return;
    }

    settleUpInput.current.value = lender.sum >= borrower.sum ? borrower.sum : lender.sum;
  }, [borrower]);

  const onPaybackHandler = async (event) => {
    event.persist();
    const inputValue = +settleUpInput.current.value;

    if (+inputValue > +borrower.sum) {
      alert(`Введенная сумма больше требуемой - ${borrower.sum}`)
      return;
    }

    const updatedDebtSum = borrower.sum - inputValue;
    const updatedOwedSum = lender.sum - inputValue;

    const updatedBorrowers = borrowers.reduce((acc, user) => {
      if (user.name === borrower.name) {
        if (updatedDebtSum > 0) {
          return [...acc, {
            ...user,
            sum: updatedDebtSum,
          }];
        }

        return acc;
      }

      return [...acc, user];
    }, []);

    const updatedLenders = lenders.reduce((acc, user) => {
      if (user.name === lender.name) {
        if (updatedOwedSum > 0) {
          return [...acc, {
            ...user,
            sum: updatedOwedSum,
          }];
        }

        return acc;
      }

      return [...acc, user];
    }, []);

    try {
      const data = await request(
        `/api/expense/update/${expenseId}`,
        'POST',
        {
          borrowers: [...updatedBorrowers],
          lenders: [...updatedLenders],
          repaid: [
            { name: borrower.name, sum: settleUpInput.current.value, payBackTo: lender.name },
          ],
        },
        {
          Authorization: `Bearer ${token}`
        }
      );

      // history.push(`/expense/list`);
      // message(data.message);
      setBorrowers([...updatedBorrowers]);
      setLenders([...updatedLenders]);
      onCloseModal(event);

    } catch (e) {
      message(e.message, 'error');
    }
  };

  // if (loading) {
  //   return <Loader/>;
  // }

  return currentRepay && (
    <div className="settle-up">
      <div className="settle-up__header">
        <div className="settle-up__back-btn">
          <a onClick={onCloseModal}>
            <span>❮</span>
          </a>
        </div>
        <div className="settle-up__title">Детали оплаты</div>
      </div>
      <div className="settle-up__content">
        <div className="settle-up__payback-status">
          <p>
            Пользователь <span>{borrower.name}</span> возвращает средства пользователю <span>{lender.name}</span>.
          </p>
          <p>Отредактируйте сумму при необходимости.</p>
        </div>
        <div className="settle-up__payback-widget">
          <div className="settle-up__payback-process">
            <div className="settle-up__payback-from">
              {borrower.name}
            </div>
            <div className="settle-up__payback-arrow">⟶</div>
            <div className="settle-up__payback-to">
              {lender.name}
            </div>
          </div>
          <div className="form settle-up__payback-sum">
            <input
              className="form__input"
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              ref={settleUpInput}
            />
          </div>
          <div className="settle-up__btn-apply">
            <button
              className="btn btn--text"
              onClick={onPaybackHandler}
            >
              Подвердить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
