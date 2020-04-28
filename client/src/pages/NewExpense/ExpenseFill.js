import React, { useEffect, useState } from "react";

export const ExpenseFill = ({payers, amount, notPayers, setNotPayers, closeModal, setPayers, setSplitStatus, payersAmount, setPayersAmount}) => {
  const [enteredAmount, setEnteredAmount] = useState(0);

  useEffect(() => {
    if (Object.keys(payersAmount).length <= 0) {
      return;
    }

    const checkSplitStatus = () => {
      let savedSum = 0;
      let defaultText = 'Поровну';

      payers.forEach((payer, index) => {
        if (index === 0) {
          savedSum = payer.sum;
        }

        if ( savedSum === payer.sum) {
          return;
        }

        defaultText = 'Не поровну';
      });

      return defaultText;
    };

    setSplitStatus(checkSplitStatus());
  }, [payers]);

  useEffect(() => {
    const sum = Object.keys(payersAmount).reduce((acc, current) => acc + payersAmount[current], 0);
    setEnteredAmount(sum);

  }, [payersAmount]);

  const onAmountFill = (event) => {
    event.preventDefault();

    setPayersAmount({
      ...payersAmount,
      [event.target.name]: +event.target.value
    });

  };

  const saveAmount = (event) => {
    const amountToInt = +amount;

    if (enteredAmount > amountToInt) {
      alert(`Сумма распределена неверно. Введено на ${enteredAmount - amountToInt} больше, чем общая сумма оплаты: ${amountToInt}`);
      return;
    }

    if (enteredAmount < amountToInt) {
      alert(`Сумма распределена неверно. Введено на ${amountToInt - enteredAmount} меньше, чем общая сумма оплаты: ${amountToInt}`);
      return;
    }

    const defineNotPayerQty = Object.keys(notPayers).reduce((sum, user) => {
      return sum + (+notPayers[user]);
    }, 0);


    const splitAmount = defineNotPayerQty > 0 ? amountToInt / (payers.length - defineNotPayerQty) : amountToInt / payers.length;

    const updatedPayers = payers.map((payer) => {
      const defineDebt = (sum = 0) => {
        if (notPayers[payer.name] === true) {
          if (sum === 0) {
            return {
              isLender: false,
              isPayer: false,
              sum: 0,
            };
          }

          return {
            isLender: true,
            isPayer: false,
            sum: Math.round(sum * 100) / 100,
          }
        }

        if (sum > splitAmount) {
          return {
            isLender: true,
            isPayer: true,
            sum: Math.round((sum - splitAmount) * 100) / 100,
          }
        }

        if (sum < splitAmount) {
          return {
            isLender: false,
            isPayer: true,
            sum: Math.round((splitAmount - sum) * 100) / 100,
          }
        }

        return {
          isLender: false,
          isPayer: true,
          sum: Math.round((splitAmount) * 100) / 100,
        }
      };

      return {
        ...payer,
        ...defineDebt(payersAmount[payer.name]),
      }
    });

    setPayers([...updatedPayers]);
    closeModal(event);
  };

  const defineNotPayers = (event) => {
    setNotPayers({...notPayers, [event.target.name]: !event.target.checked});
  };

  return (
    <div className="expense-fill">
      <div className="expense-fill__header">
        <div className="expense-fill__btn expense-fill__btn--save">
          <button
            onClick={saveAmount}
          >
            Готово
          </button>
        </div>
        <div className="expense-fill__title">Укажите сумму</div>
        <div className="expense-fill__btn expense-fill__btn--close">
          <button
            onClick={closeModal}
          >
            ×
          </button>
        </div>
      </div>
      <div className="expense-fill__content">
        <form className="expense-fill__form">
          {
            payers.length && payers.map((payer) =>
              <div className="expense-fill__item" key={payer.name}>
                <span className="expense-fill__name">
                  {payer.name}
                </span>
                <label className="checkbox-switcher">
                  <input
                    type="checkbox"
                    name={payer.name}
                    defaultChecked={notPayers[payer.name] ? notPayers[payer.name] === false : true} onChange={defineNotPayers}
                  />
                  <span className="track thumb"/>
                </label>
                <div className="expense-fill__input-row">
                  <span>₴</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    placeholder="0.00"
                    name={payer.name}
                    className="form__input"
                    value={payersAmount[payer.name] ? payersAmount[payer.name] : ''}
                    onChange={onAmountFill}
                  />
                </div>
              </div>
            )}
        </form>
        <div className="expense-fill__footer">
          <div className="expense-fill__calculation">
            <div>{enteredAmount} из <span>{amount}</span></div>
            <div>
              Осталось:
              <span
                className={enteredAmount <= amount ? 'expense-fill__correct' : 'expense-fill__wrong'}>
                      {` ${amount - enteredAmount}`}
                    </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}