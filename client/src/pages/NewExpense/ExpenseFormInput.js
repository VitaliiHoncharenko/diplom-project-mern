import React from "react";

export const ExpenseFormInput = ({onChangeTitle, title, onChangeAmount, amount}) => {

  return (
    <div className="form__group">
      <div className="form__row">
        <input
          className="form__input"
          placeholder=" "
          type="text"
          value={title}
          onChange={onChangeTitle}
        />
        <label className="form__label">
          Введите название оплаты
        </label>
      </div>
      <div className="form__row">
        <input
          className="form__input"
          placeholder=" "
          type="number"
          inputMode="decimal"
          value={amount}
          onChange={onChangeAmount}
        />
        <label className="form__label">
          Введите сумму оплаты
        </label>
      </div>
    </div>
  )
};