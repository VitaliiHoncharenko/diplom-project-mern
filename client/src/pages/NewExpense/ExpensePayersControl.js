import React, { useState } from 'react';

export const ExpensePayersControl = ({ openEqualPayersModal, openUnequalPayersModal }) => {
  const [isShowEqualTooltip, setIsShowEqualTooltip] = useState(false);
  const [isShowUnequalTooltip, setIsShowUnequalTooltip] = useState(false);
  const [timerId, setTimerId] = useState(0);

  const hideTooltips = () => {
    const timerTooltip = setTimeout(() => {
      setIsShowUnequalTooltip(false);
      setIsShowEqualTooltip(false);
    }, 5000);

    setTimerId(timerTooltip);
  };

  const onEqualTooltipShow = () => {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }

    setIsShowEqualTooltip(!isShowEqualTooltip);
    setIsShowUnequalTooltip(false);
    hideTooltips();
  };

  const onUnequalTooltipShow = () => {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }

    setIsShowUnequalTooltip(!isShowUnequalTooltip);
    setIsShowEqualTooltip(false);
    hideTooltips();
  };

  return (
    <div className="new-expense__status-info">
      <div className="new-expense__block">
        <button
          className="btn btn--text new-expense__text-btn"
          onClick={openEqualPayersModal}
        >
          <span>Поровну</span>
        </button>
        <span className="tooltip"
              onClick={onEqualTooltipShow}
        >
          <i>?</i>
          {isShowEqualTooltip && <span className="tooltip__text">
            Подходит при одинаковой сумме для каждого участника (кино, музей, билеты на транспорт...)
          </span>}
        </span>
      </div>
      <span className="new-expense__or"><span>или</span></span>
      <div className="new-expense__block">
        <button
          className="btn btn--text new-expense__text-btn"
          onClick={openUnequalPayersModal}
        >
          <span>Непоровну</span>
        </button>
        <span className="tooltip"
              onClick={onUnequalTooltipShow}
        >
          <i>?</i>
          {isShowUnequalTooltip && <span className="tooltip__text">
            Подходит при разной сумме для каждого участника (кафе, магазин, бар...)
          </span>}
        </span>
      </div>
    </div>
  );
};
