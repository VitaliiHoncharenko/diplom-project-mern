import React from "react";

export const ExpensePayersControl = ({openModal, payersStatus}) => {
  return (
    <div className="expense-create__status-info">
      <div className="expense-create__block">
        <span>Кто платит?</span>
        <button
          className="btn btn--text expense-create__text-btn"
          onClick={e => openModal(e)}
        >
          <span>{payersStatus}</span>
        </button>
      </div>
      <div className="expense-create__block">
        <span>Как делим?</span>
        <button className="btn btn--text expense-create__text-btn"
                onClick={e => openModal(e)}
        >
          <span>Поровну </span>
        </button>
      </div>
    </div>
  )
};