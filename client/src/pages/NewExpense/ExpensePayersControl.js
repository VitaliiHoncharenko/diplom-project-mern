import React from "react";

export const ExpensePayersControl = ({openEqualPayersModal, openUnequalPayersModal, payersStatus, splitStatus}) => {
  return (
    <div className="expense-create__status-info">
      <div className="expense-create__block">
        <span>Кто платит?</span>
        <button
          className="btn btn--text expense-create__text-btn"
          onClick={openEqualPayersModal}
        >
          <span>{payersStatus}</span>
        </button>
      </div>
      <div className="expense-create__block">
        <span>Как делим?</span>
        <button
          className="btn btn--text expense-create__text-btn"
          onClick={openUnequalPayersModal}
        >
          <span>{splitStatus}</span>
        </button>
      </div>
    </div>
  )
};