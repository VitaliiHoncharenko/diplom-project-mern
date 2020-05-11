import React, { useEffect, useState } from 'react';
import Select from 'react-select';

export const ExpenseUnequal = ({ amount, payers, closeModal }) => {
  const [isBillData, setIsBillData] = useState(false);
  const [isPayData, setIsPayData] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);


  const [remainingAmount, setRemainingAmount] = useState(0);
  const [billData, setBillData] = useState(null);
  const [payData, setPayData] = useState(null);
  const [loaners, setLoaners] = useState({});
  const [loanersAndLenders, setLoanersAndLenders] = useState({});

  useEffect(() => {
    const payersData = payers.reduce((all, payer) => {
      return { ...all, [payer.name]: '' };
    }, {});

    setBillData(payersData);
    setPayData(payersData);

  }, [payers]);

  const onBackHandler = () => {
    if (isPayData === true) {
      setIsPayData(false);
      setLoanersAndLenders({});

      return;
    }

    setIsBillData(false);
  };

  const onBillDataChange = (event) => {
    const { name, value } = event.target;

    const updatedBillData = {
      ...billData,
      [name]: value,
    };

    setBillData(updatedBillData);

    const totalSum = Object.keys(updatedBillData).reduce((all, user) => {
      const sumToInt = +updatedBillData[user];

      return all + sumToInt;
    }, 0);

    setRemainingAmount(totalSum);
  };

  const onPayDataChange = (event) => {
    const { name, value } = event.target;

    setPayData({
      ...payData,
      [name]: value,
    });
  };

  const onBillDataHandler = () => {
    const isDataNotFull = Object.keys(billData).some((user) => {
      return billData[user] === '';
    });

    if (isDataNotFull) {
      alert('Не все данные введены');
      return;
    }

    if (remainingAmount < amount) {
      alert('Общая сумма распределена неверно');
    }

    setIsBillData(true);
  };

  const onPayDataHandler = () => {
    const amountToInt = amount;

    const totalPayAmount = Object.keys(payData).reduce((all, name) => {
      const sumToInt = +payData[name];

      return all + sumToInt;
    }, 0);

    if (amountToInt > totalPayAmount) {
      alert('Общая сумма оплаты не распределена корректно');
      return;
    }

    if (amountToInt < totalPayAmount) {
      alert('Общая сумма оплаты не распределена корректно');
      return;
    }

    const payersWithLenders = {};

    Object.keys(payData).forEach((name, index) => {
      if (+payData[name] === +billData[name]) {
        return;
      }

      if (+payData[name] < +billData[name]) {
        payersWithLenders[name] = true;
      }
    });

    setLoaners(payersWithLenders);
    setIsPayData(true);
  };

  const onSelectPersonalLender = (selected, currentLoaner) => {

    // const { value } = event.target;
    setSelectedOptions({
      ...selectedOptions,
      [currentLoaner]: selected,
    });

    // if (value === 'Выбрать') {
    //   const updatedLoaners = { ...loanersAndLenders };
    //   delete updatedLoaners[currentLoaner];
    //   setLoanersAndLenders(updatedLoaners);
    //
    //   return;
    // }

    // const defaultLenderSum = (payData[value] - billData[value]) > billData[currentLoaner]
    //   ? billData[currentLoaner]
    //   : payData[value] - billData[value];
    // const lenderSum = prompt(`Сколько заплатит за вас ${value}?`, `${payData[value] - billData[value]}`);
    // const isSumCorrect = /^[+-]?\d+(\.\d+)?$/.test(lenderSum);
    //
    // if (isSumCorrect === false) {
    //   // setLoanersAndLenders({});
    //   return;
    // }
    // debugger
    // console.log(loaners);
    // const loanersAndLenders = Object.keys(loaners).reduce((all, loaner) => {
    //   return {...all, [loaners[loaner]]: event.target.value}
    // }, {});


    // setLoanersAndLenders({
    //   ...loanersAndLenders,
    //   [currentLoaner]: [value, lenderSum],
    // });
  };

  const onDataSave = () => {
    debugger
  };

  const isOptionAdd = (payer, user) => {
    if (+payData[user.name] <= +billData[user.name]) {
      return false;
    }

    return payer.name !== user.name;
  };

  return (
    <div className="expense-unequal">
      <div className="header">
        <a className="header__btn-save">
          <span>Сохранить</span>
        </a>
        <div className="header__title">Укажите сумму</div>
        <a className="header__btn-close"
           onClick={closeModal}
        >
          <span>×</span>
        </a>
      </div>

      <div className="expense-unequal__hint">
        Введите сумму для каждого пользователя, указанную в чеке

        <div className="expense-unequal__amount">
          <div>{remainingAmount} из {amount}</div>
          <div>Осталось: {amount - remainingAmount}</div>
        </div>
      </div>

      <div className="expense-unequal__content">
        <ul className="expense-unequal__names">
          {payers.map((payer, index) => {
            return (
              <li key={index}>
                {payer.name}
              </li>
            );
          })}
        </ul>
        <ul className="expense-unequal__check-fields">
          {payers.map((payer, index) => {
            return (
              <li key={index}>
                <input
                  className="input"
                  type="number"
                  placeholder="0.00"
                  name={payer.name}
                  value={billData !== null ? billData[payer.name] : ''}
                  disabled={isBillData === true}
                  onChange={onBillDataChange}
                />
              </li>
            );
          })}
        </ul>
        {isBillData && <ul className="expense-unequal__pay-fields">
          {payers.map((payer, index) => {
            return (
              <li key={index}>
                <input
                  className="input"
                  type="number"
                  placeholder="0.00"
                  name={payer.name}
                  value={payData !== null ? payData[payer.name] : ''}
                  onChange={onPayDataChange}
                />
              </li>
            );
          })}
        </ul>}
        {isPayData && <ul className="expense-unequal__select-personal-payer">
          {payers.map((payer, index) => {
            return (
              <li key={index}>
                {/*{loaners[payer.name] && <select onChange={event => onSelectPersonalLender(event, payer.name)}>*/}
                {/*  <option defaultValue="true" value="Выбрать">Выбрать</option>*/}
                {/*  {*/}
                {/*    payers.map((user, idx) => {*/}
                {/*      return isOptionAdd(payer, user) && (*/}
                {/*        <option*/}
                {/*          key={idx}*/}
                {/*          value={user.name}*/}
                {/*        >*/}
                {/*          {user.name} {loanersAndLenders[payer.name] ? `(${loanersAndLenders[payer.name][1]})` : ''}*/}
                {/*        </option>*/}
                {/*      );*/}
                {/*    })*/}
                {/*  }*/}
                {/*</select>}*/}

                {loaners[payer.name] && <Select
                  value={loanerOptions[payer.name]}
                  isMulti
                  onChange={selected => onSelectPersonalLender(selected, payer.name)}
                  options={
                    payers.map((user) => {
                        return { value: user.name, label: user.name }
                      })
                    }
                /> }
              </li>
            );
          })}
        </ul>}
      </div>

      <div className="expense-unequal__control">
        {isBillData && <button
          className="btn btn--text"
          onClick={onBackHandler}
        >
          Назад
        </button>}

        {!isBillData && <button
          className="btn btn--text"
          onClick={onBillDataHandler}
        >
          Продолжить
        </button>}

        {isBillData && !isPayData && <button
          className="btn btn--text"
          onClick={onPayDataHandler}
        >
          Продолжить
        </button>}

        {isPayData && <button
          className="btn btn--text"
          onClick={onDataSave}
        >
          Сохранить
        </button>}
      </div>

    </div>
  );
};