import React, { useEffect, useState } from 'react';
import { Transition } from 'react-transition-group';

const duration = 100;

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
  height: 0,
  opacity: 0,
  overflow: 'hidden',
};

const transitionStyles = {
  entering: { opacity: 0, height: 0 },
  entered: { opacity: 1, height: '100%' },
  exiting: { opacity: 1, height: '100%' },
  exited: { opacity: 0, height: 0 },
};

export const List = ({ items, lenders, borrowers }) => {
  const [payersCategory, setPayersCategory] = useState([]);
  const [isShowInfo, setIsShowInfo] = useState([]);
  const [isBorrowers, setIsBorrowers] = useState(false);


  useEffect(() => {
    if (lenders !== undefined && lenders.length > 0) {
      setPayersCategory([...lenders]);
      setIsBorrowers(false);
      return;
    }

    if (borrowers !== undefined && borrowers.length > 0) {
      setPayersCategory([...borrowers]);
      setIsBorrowers(true);
    }

  }, [lenders, borrowers]);


  useEffect(() => {
    const infoList = items.map(() => {
      return false;
    });

    setIsShowInfo([...infoList]);
  }, [items]);

  const onToggleHandler = (index) => {
    const updateShowInfoList = [...isShowInfo];
    updateShowInfoList[index] = !updateShowInfoList[index];
    setIsShowInfo([...updateShowInfoList]);
  };

  const showSum = (outerItems, outerItem, subItems, subItem) => {
    if (isBorrowers) {
      return subItems.length > 1 ? subItem.sum / outerItems.length : null;
    }

    return subItems.length > 1 ? outerItem.sum / subItems.length : null;
  };

  return (
    <ul className="expense-details__list">
      {
        items.map((item, index) => {
          return (
            <li
              key={index}
              className={`expense-details__list-item ${isShowInfo[index] ? 'expense-details__list-item--open' : ''}`}
            >
              <div
                className="expense-details__item-outer"
                onClick={() => onToggleHandler(index)}
              >
                <div className="expense-details__item-name">
                  {item.name}
                </div>
                <div className="expense-details__item-sum">
                  {item.sum}
                </div>
                <div className="expense-details__btn-more">
                  <button
                    className="btn btn--text"
                    onClick={() => onToggleHandler(index)}
                  >
                    {isShowInfo[index] ? 'Скрыть' : 'Подробнее'}
                  </button>
                </div>
              </div>
              <Transition in={isShowInfo[index]} timeout={duration}>
                {state => (
                  <div style={{
                        ...defaultStyle,
                        ...transitionStyles[state]
                      }}
                       className="expense-details__item-info"
                  >
                    <div className="expense-details__sub-list-outer">{isBorrowers ? 'Кто должен:' : 'Кому вернуть:'}</div>
                    <ul className="expense-details__sub-list">
                      {
                        payersCategory.map((subItem, idx) => {
                          return (
                            <li
                              key={idx}
                              className="expense-details__sub-item"
                            >
                              <div className="expense-details__sub-item-name">{subItem.name}</div>
                              <div className="expense-details__sub-item-sum">
                                {showSum(items, item, payersCategory, subItem)}
                              </div>
                              <div className="expense-details__btn-payback">
                                <button className="btn btn--text">Вернуть</button>
                              </div>
                            </li>
                          );
                        })
                      }
                    </ul>
                  </div>
                )}
              </Transition>
            </li>
          );
        })
      }
    </ul>
  );
};