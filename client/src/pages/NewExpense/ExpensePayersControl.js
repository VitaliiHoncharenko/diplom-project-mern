import React from "react";

export const ExpensePayersControl = ({openEqualPayersModal, openUnequalPayersModal, payersStatus, splitStatus}) => {
  return (
    <div className="new-expense__status-info">
      <div className="new-expense__block">
        <span>Кто платит?</span>
        <button
          className="btn btn--text new-expense__text-btn"
          onClick={openEqualPayersModal}
        >
          <span>{payersStatus}</span>
        </button>
      </div>
      <div className="new-expense__block">
        <span>Как делим?</span>
        <button
          className="btn btn--text new-expense__text-btn"
          onClick={openUnequalPayersModal}
        >
          <span>{splitStatus}</span>
        </button>
      </div>
    </div>
  )
};