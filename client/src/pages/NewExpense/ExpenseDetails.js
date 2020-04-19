import React from "react";

export const ExpenseDetails = ({isSinglePayer, lendersQty, closeModal, payers, setSinglePayer, setPayers}) => {
  const onPayerChanged = (event) => {
    const updatedPayers = payers.map((payer) => ({
      name: payer.name,
      isPayer: event.target.value === payer.name,
    }));

    setPayers([
      ...updatedPayers,
    ]);
    closeModal(event);
  };

  const onMultiplePayers = (event) => {
    const updatedPayers = payers.map((payer) => {
      const checkValue = () => {
        if (payer.name === event.target.name) {
          return event.target.checked;
        }

        return payer.isPayer;
      };

      return {
        name: payer.name,
        isPayer: checkValue(),
      }
    });

    const isAnyPayer = updatedPayers.some((payer) => payer.isPayer === true);

    if (isAnyPayer === false) {
      alert('Как минимум один человек участвует в оплате');
      return;
    }

    setPayers([
      ...updatedPayers,
    ]);
  };

  return (
    <div className={`expense-payers ${lendersQty > 1 ? 'expense-payers--multi' : ''}`}>
      { isSinglePayer === true && <div className='expense-payers__single-payer'>
        <div className="expense-payers__header">
          <div className="expense-payers__btn expense-payers__btn--back">
            <button
              onClick={e => closeModal(e)}
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
                         checked={lendersQty === 1 && payer.isPayer === true}
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
      </div> }

      { isSinglePayer === false && <div className="expense-payers__multiple-payers">
        <div className="expense-payers__header">
          <div className="expense-payers__btn expense-payers__btn--back">
            <button
              onClick={() => setSinglePayer(true)}
            >
              ❮
            </button>
          </div>
          <div className="expense-payers__title">Выбрать нескольких</div>
          <div className="expense-payers__btn expense-payers__btn--close">
            <button
              onClick={e => closeModal(e)}
            >
              ×
            </button>
          </div>
        </div>
        <div className="expense-payers__content">
          <div className="expense-payers__list">
            {
              payers.length && payers.map((payer, index) =>
                <div className="check-radio expense-payers__item" key={payer.name}>
                  <input
                    id={`check-payer-${index}`}
                    className="check-radio__input"
                    type="checkbox"
                    name={payer.name}
                    checked={payer.isPayer}
                    onChange={e => onMultiplePayers(e)}
                  />
                  <label className="check-radio__label" htmlFor={`check-payer-${index}`}>
                    {payer.name}
                  </label>
                </div>
              )}
          </div>
        </div>
      </div> }
    </div>
  )
}