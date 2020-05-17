import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Modal from 'react-bootstrap/Modal'

export const NewExpenseUnequal = ({ amount, payers, setPayers, closeModal }) => {
  const [state, setState] = useState({
    unequalPayers: [],
    totalBillAmount: 0,
    totalPayAmount: 0,
  });

  const [isBillData, setIsBillData] = useState(false);
  const [isPayData, setIsPayData] = useState(false);

  const [optionsList, setOptionsList] = useState([]);

  const [show, setShow] = useState(false);
  const [lenderSum, setLenderSum] = useState('');
  const [selectedItems, setSelectedItems] = useState({});
  const [currentLender, setCurrentLender] = useState('');
  const [currentLoaner, setCurrentLoaner] = useState('');

  const [lendersSumList, setLendersSumList] = useState({});
  const [lendersSumListInfo, setLendersSumListInfo] = useState({});

  const handleShow = () => setShow(true);

  useEffect(() => {
    const createUnequalPayersList = payers.map((payer) => {
      return {
        name: payer.name,
        billSum: '',
        paySum: '',
        isLoaner: false,
        personalLender: {},
      };
    });

    if (isBillData === false) {
      setState({
        ...state,
        unequalPayers: createUnequalPayersList,
      });
    }

  }, [payers, isBillData]);

  useEffect(() => {
    if (isPayData === false) {
      return
    }

    if (state.unequalPayers.length === 0) {
      return;
    }

    const createSelectOptions = state.unequalPayers.reduce((all, payer) => {
      const paySumToInt = +payer.paySum;
      const billSumToInt = +payer.billSum;

      if (paySumToInt > billSumToInt) {
        return [
          ...all,
          { value: payer.name, label: payer.name }
        ];
      }

      return all;
    }, []);

    if (createSelectOptions.length === 1) {
      const updatedUnequalPayers = state.unequalPayers.map((payer) => {
        const singleLender = createSelectOptions[0].value;

        if (+payer.billSum > +payer.paySum) {
          return {
            ...payer,
            personalLender: {
              [singleLender]: +payer.billSum - +payer.paySum,
            }
          }
        }

        return payer;
      });

      setState({
        ...state,
        unequalPayers: updatedUnequalPayers,
      })
    }

    setOptionsList(createSelectOptions);

  }, [isPayData]);

  useEffect(() => {
    if (Object.keys(lendersSumList).length === 0) {
      return;
    }

    const loanerList = Object.keys(lendersSumList).reduce((total, loaner) => {

      const lenderList = Object.keys(lendersSumList[loaner]).map((lender) => {
          return {name: lender, sum: lendersSumList[loaner][lender]}
      });

      return {
        ...total,
        [loaner]: lenderList,
      }
    }, {});

    setLendersSumListInfo(loanerList);

  }, [lendersSumList]);

  const onBackHandler = () => {
    if (isPayData === true) {

      setState({
        ...state,
        unequalPayers: [
          ...state.unequalPayers.map((payer) => {
            return {
              ...payer,
              isLoaner: false,
            };
          })
        ],
      });

      setSelectedItems({});

      setIsPayData(false);

      return;
    }

    setIsBillData(false);
  };

  const onPayAmountChecker = (payType) => {
    const isAnyPayer = state.unequalPayers.some((item) => !!(+item[payType]));
    const totalAmount = payType === 'billSum' ? state.totalBillAmount : state.totalPayAmount;

    if (isAnyPayer === false) {
      alert('Выберите как минимум одного плательщика');
      return false;
    }

    if (totalAmount < amount) {
      alert('Указанной суммы недостаточно, чтобы покрыть расходы');
      return false;
    }

    if (totalAmount > amount) {
      alert('Указанная сумма больше, чем фактическая стоимость оплаты');
      return false;
    }

    return true;
  };

  const onBillDataHandler = () => {
    if (onPayAmountChecker('billSum') === false) {
      return;
    }

    setState({
      ...state,
      unequalPayers: state.unequalPayers.filter((item) => !!(+item.billSum)),
    });
    setIsBillData(true);
  };

  const onPayDataHandler = () => {
    if (onPayAmountChecker('paySum') === false) {
      return;
    }

    const updatedUnequalPayers = state.unequalPayers.map((payer) => {
      const billSumToInt = +payer.billSum;
      const paySumToInt = +payer.paySum;

      if (paySumToInt < billSumToInt) {
        return {
          ...payer,
          isLoaner: true,
        };
      }

      return payer;
    });

    setState({
      ...state,
      unequalPayers: updatedUnequalPayers,
    });

    setIsPayData(true);
  };

  const onDataChange = (event) => {
    const { value, name } = event.target;
    const sum = !isBillData ? 'billSum' : 'paySum';
    const totalAmount = !isBillData ? 'totalBillAmount' : 'totalPayAmount';

    const updatedUnequalPayers = state.unequalPayers.map((payer) => {
      if (name === payer.name) {
        return {
          ...payer,
          [sum]: value,
        };
      }

      return payer;
    });

    const totalSum = updatedUnequalPayers.reduce((all, user) => {
      const sumToInt = +user[sum];

      return all + sumToInt;
    }, 0);

    setState({
      ...state,
      unequalPayers: updatedUnequalPayers,
      [totalAmount]: totalSum,
    });
  };

  const onLenderSumChange = (event) => {
    const {value} = event.target;

    setLenderSum(value);
  };

  const onSaveLenderSum = () => {
    const lenderAndPrice = {};
    let currentLenderInfo = null;

    state.unequalPayers.filter((payer) => {
      if (payer.name === currentLender) {
        currentLenderInfo = payer;
      }

      if (payer.isLoaner === true) {
        Object.keys(payer.personalLender).filter((lender) => {
          lenderAndPrice[lender] = (lenderAndPrice[lender] !== undefined) ? +lenderAndPrice[lender] + +payer.personalLender[lender] : +payer.personalLender[lender];
        });

      }
    });

    const diff = +currentLenderInfo.paySum - +currentLenderInfo.billSum;

    if (diff < +lenderSum) {
      alert('Недостаточно средств у заемщика, чтобы покрыть этот расход');
      return
    }

    if (lenderAndPrice[currentLender] !== undefined && +lenderSum > +lenderAndPrice[currentLender] - diff) {
      alert('Заемщику уже дал взаймы другому пользователю.');
      return;
    }

    const formatLenderInfo = {
      [currentLoaner]: { [currentLender]: lenderSum }
    };

    setLendersSumList({
      ...lendersSumList,
      [currentLoaner]: {...lendersSumList[currentLoaner], ...formatLenderInfo[currentLoaner]},
    });


    const updatedUnequalPayers = state.unequalPayers.map((payer) => {
      const isLoaner = formatLenderInfo[payer.name] !== undefined;

      if (isLoaner) {
        return {
          ...payer,
          personalLender: {
            ...payer.personalLender,
            ...formatLenderInfo[payer.name],
          },
        };
      }

      return payer;
    });

    setState({
      ...state,
      unequalPayers: updatedUnequalPayers,
    });


    handleClose();
  };

  const handleClose = () => {
    setShow(false)
  };

  const onSelectLender = (items, loanerName) => {
    const sumToInt = (sum) => +sum;
    const currentLenderValue = items === null ? '' : items.value;

    setCurrentLender(currentLenderValue);
    setCurrentLoaner(loanerName);

    const formatItems = [items.value];
    const updatedSelectedItems = {
      ...selectedItems,
      [loanerName]: {[formatItems[0]]: 0}
    };

    setSelectedItems(updatedSelectedItems);

    const savedSelectedQty = selectedItems[loanerName] === undefined ? 0 : Object.keys(selectedItems[loanerName]).length;
    const currentSelectedQty = Object.keys(updatedSelectedItems[loanerName]).length;

    if (savedSelectedQty <= currentSelectedQty ) {
      const currentLenderInfo = state.unequalPayers.find((payer) => payer.name === currentLenderValue);
      const currentLoanerInfo = state.unequalPayers.find((payer) => payer.name === loanerName);

      const predictedSum = () => {
        const lenderBillSum = sumToInt(currentLenderInfo.billSum);
        const lenderPaySum = sumToInt(currentLenderInfo.paySum);
        const loanerBillSum = sumToInt(currentLoanerInfo.billSum);
        const loanerPaySum = sumToInt(currentLoanerInfo.paySum);

        const extraPay = lenderPaySum - lenderBillSum;
        const loanerDiff = loanerBillSum - loanerPaySum;

        if (extraPay >= loanerDiff) {
          return `${loanerDiff}`
        }

        return `${extraPay}`;
      };

      setLenderSum(predictedSum());

      handleShow();
    } else {
      const updatedUnequalPayers = state.unequalPayers.map((payer) => {
        const updatedLenders = {};

        const updatedLenderInfo = (lenderList) => {
          formatItems.forEach((item) => {
            Object.keys(lenderList).forEach((subItem) => {
              if (item === subItem) {
                updatedLenders[subItem] = lenderList[subItem];
              }
            })
          });

          return updatedLenders;
        };

        if (loanerName === payer.name ) {
          setLendersSumList({
            ...lendersSumList,
            [payer.name]: updatedLenderInfo(payer.personalLender),
          });

          return {
            ...payer,
            personalLender: updatedLenderInfo(payer.personalLender),
          };
        }

        return payer;
      });

      setState({
        ...state,
        unequalPayers: updatedUnequalPayers,
      });
    }
  };

  const onDataSave = (event) => {
    let ifCorrectData = true;
    const newPayersList = state.unequalPayers;

    newPayersList.forEach((payer) => {
      if (+payer.billSum > +payer.paySum) {

        const totalLenderSum = Object.keys(payer.personalLender).reduce((total, current) => {
          return total + +payer.personalLender[current];
        }, 0);

        if (+payer.billSum !== totalLenderSum + +payer.paySum ) {
          ifCorrectData = false;
        }
      }
    });

    if (ifCorrectData === false) {
      alert('Данные о платеже введены некорректно. Попробуйте еще раз');
      return;
    }

    const updatedPayers = newPayersList.map((payer) => {
      return {
        name: payer.name,
        isLender: !payer.isLoaner,
        isPayer: true,
        sum: payer.isLoaner ? +payer.billSum : +payer.paySum - +payer.billSum,
        personalLender: payer.personalLender,
      }
    });

    setPayers(updatedPayers);
    closeModal(event);
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
        {isBillData === false
          ? 'Введите сумму для каждого пользователя, указанную в чеке. Оставьте поле пустым, если пользователь не участвовал в оплате.'
          : 'Введите сумму, которую вы готовы заплатить. Или ничего не вводите, если заплатите позже' }

          <div className="expense-unequal__amount">
          <div>{isBillData === false ? state.totalBillAmount : state.totalPayAmount} из {amount}</div>
          <div>Осталось: {amount - (isBillData === false ? state.totalBillAmount : state.totalPayAmount)}</div>
        </div>
      </div>

      <div className="expense-unequal__content">
        {isBillData === false && <ul className="expense-unequal__list-bill">
          {
            state.unequalPayers.map((payer, index) => {
              return (
                <li key={index}>
                  <div className="expense-unequal__inner-panel">
                    <div className="expense-unequal__name">{payer.name}</div>
                    <div className="expense-unequal__bill-value">
                      <input
                        className="input"
                        type="number"
                        placeholder="0.00"
                        name={payer.name}
                        value={payer.billSum ? payer.billSum : ''}
                        onChange={onDataChange}
                      />
                    </div>
                  </div>
                </li>
              );
            })
          }
        </ul>}

        {isBillData === true && <ul className="expense-unequal__list-pay">
          {
            state.unequalPayers.map((payer, index) => {
              return (
                <li key={index}>
                  <div className="expense-unequal__inner-panel">
                    <div className="expense-unequal__name">
                      {payer.name}
                    </div>
                    <div className="expense-unequal__bill-sum">Чек: {payer.billSum}</div>
                    {isPayData === true && <span className="expense-unequal__pay-sum">Оплата: </span>}
                    <div className="expense-unequal__pay-value">
                      <input
                        className={`input expense-unequal__input ${isPayData ? 'expense-unequal__input--disabled' : ''}`}
                        type="number"
                        placeholder="0.00"
                        disabled={isPayData === true}
                        name={payer.name}
                        value={payer.paySum ? payer.paySum : ''}
                        onChange={onDataChange}
                      />
                    </div>
                  </div>
                  <div className="expense-unequal__inner-panel">
                    {payer.isLoaner && <div className="expense-unequal__select-container">
                      {optionsList.length > 1 ? <div className="expense-unequal__select-box">
                      <Select
                        className="expense-unequal__select"
                        classNamePrefix="expense-unequal-select"
                        placeholder="Кто за вас заплатит"
                        onChange={selected => onSelectLender(selected, payer.name)}
                        options={optionsList}
                      />
                        {lendersSumListInfo[payer.name] && <span className="expense-unequal__lender-sum">
                        {
                          lendersSumListInfo[payer.name].map((item, index) => {
                            return (
                              <span key={index}>
                                  { item.name } дает взаймы { item.sum }
                              </span>
                            )
                          })
                        }
                      </span>}
                      </div> : <div className="expense-unequal__select-single">{optionsList[0] !== undefined ? `За Вас платит: ${optionsList[0].label}` : '' }</div>}
                    </div>}
                  </div>
                </li>
              );
            })
          }
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

      <Modal show={show} onHide={onSaveLenderSum}>
        <Modal.Header closeButton>
          <Modal.Title>Укажите сумму</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            className="input"
            type="number"
            placeholder="0.00"
            value={lenderSum}
            name="personal-sum"
            onChange={onLenderSumChange}
          />
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn--text" onClick={onSaveLenderSum}>
            Close
          </button>
          <button className="btn btn--text" onClick={onSaveLenderSum}>
            Save Changes
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
