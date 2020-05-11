import React  from "react";
import { Transition } from 'react-transition-group';

const duration = 300;

const defaultStyleSinglePayer = {
  transition: `transform ${duration}ms ease-in-out`,
  transform: 'translateX(0)',
};

const transitionStylesSinglePayer = {
  entering: { transform: 'translateX(0)' },
  entered:  { transform: 'translateX(0)' },
  exiting:  { transform: 'translateX(-100%)' },
  exited:   { transform: 'translateX(-100%)' },
};

const defaultStyleMultiPayer = {
  transition: `transform ${duration}ms ease-in-out`,
  transform: 'translateX(-100%)',
};

const transitionStylesMultiPayer = {
  entering: { transform: 'translateX(0)' },
  entered:  { transform: 'translateX(0)' },
  exiting:  { transform: 'translateX(100%)' },
  exited:   { transform: 'translateX(100%)' },
};

export const ExpenseDetails = ({isSinglePayer, lendersQty, closeModal, payers, setSinglePayer, setPayers, amount}) => {
  const splitPayers = (group, payer) => {
    const type = payer.isLender === true ? 'lenders' : 'borrowers';

    group[type] = [...group[type], payer];

    return group;
  };

  const calculateSumPerPayer = (payersList) => {
    const {lenders, borrowers} = payersList.reduce(splitPayers, {
      lenders: [],
      borrowers: [],
    });

    const splitAmount = +amount / payers.length;

    const lendAmount = Math.round((splitAmount * borrowers.length / lenders.length) * 100) / 100;
    const debtAmount = Math.round((lendAmount * lenders.length / borrowers.length) * 100) / 100;

    return payersList.map(({name, isLender}) => {
        return {
          name,
          isLender,
          sum: isLender ? lendAmount : debtAmount,
        }
    });
  };

  const onPayerChanged = (event) => {
    const updatedPayers = payers.map((payer) => ({
      name: payer.name,
      isLender: event.target.value === payer.name,
      isPayer: true,
    }));

    const payersWithSum = calculateSumPerPayer(updatedPayers);

    setPayers([
      ...payersWithSum,
    ]);
    closeModal(event);
  };

  const onMultiplePayers = (event) => {
    const updatedPayers = payers.map((payer) => {
      const checkValue = () => {
        if (payer.name === event.target.name) {
          return event.target.checked;
        }

        return payer.isLender;
      };

      return {
        name: payer.name,
        isLender: checkValue(),
        isPayer: true,
      }
    });

    const payersWithSum = calculateSumPerPayer(updatedPayers);
    const isAnyPayer = payersWithSum.some((payer) => payer.isLender === true);

    if (isAnyPayer === false) {
      alert('Как минимум один человек участвует в оплате');
      return;
    }

    setPayers([
      ...payersWithSum,
    ]);
  };

  return (
    <div className={`expense-payers ${lendersQty > 1 ? 'expense-payers--multi' : ''}`}>

      <Transition in={isSinglePayer} timeout={duration}>
        {state => (
          <div className="expense-payers__transition"
               style={{
                ...defaultStyleSinglePayer,
                ...transitionStylesSinglePayer[state]
              }}
          >
            <div className='expense-payers__single-payer'>
              <div className="expense-payers__header">
                <div className="expense-payers__btn expense-payers__btn--back">
                  <button
                    onClick={closeModal}
                  >
                    ❮
                  </button>
                </div>
                <div className="expense-payers__title">
                  Выберите плательщика
                </div>
              </div>
              <div className="expense-payers__content">
                <div className="expense-payers__list">
                  {
                    payers.length && payers.map((payer, index) =>
                      <div className="check-radio check-radio--row expense-payers__item" key={payer.name}>
                        <input type="radio"
                               id={`check-payer-${index}`}
                               className="check-radio__input"
                               value={payer.name}
                               checked={lendersQty === 1 && payer.isLender === true}
                               onChange={e => onPayerChanged(e)}
                        />
                        <label
                          className="check-radio__label"
                          htmlFor={`check-payer-${index}`}
                        >
                          {payer.name}
                        </label>
                      </div>
                    )}
                </div>
              </div>
              <button
                className='expense-payers__show-multi-btn'
                onClick={() => setSinglePayer(false)}
              >
                Выбрать нескольких
              </button>
            </div>
          </div>
        )}
      </Transition>

      <Transition in={!isSinglePayer} timeout={duration}>
        {state => (
          <div className="expense-payers__transition"
               style={{
                ...defaultStyleMultiPayer,
                ...transitionStylesMultiPayer[state]
              }}
          >
            <div className="expense-payers__multiple-payers">
            <div className="header">
              <a className="header__btn-back"
                 onClick={() => setSinglePayer(true)}
              >
                <span>❮</span>
              </a>
              <div className="header__title">Выбрать нескольких</div>
              <a className="header__btn-close"
                 onClick={closeModal}
              >
                <span>×</span>
              </a>
            </div>
            <div className="expense-payers__content">
              <div className="expense-payers__list">
                {
                  payers.length && payers.map((payer, index) =>
                    <div className="check-radio expense-payers__item" key={payer.name}>
                      <input
                        id={`check-multi-${index}`}
                        className="check-radio__input"
                        type="checkbox"
                        name={payer.name}
                        checked={payer.isLender}
                        onChange={onMultiplePayers}
                      />
                      <label className="check-radio__label" htmlFor={`check-multi-${index}`}>
                        {payer.name}
                      </label>
                    </div>
                  )}
              </div>
            </div>
          </div>
          </div>
        )}
      </Transition>

    </div>
  )
}