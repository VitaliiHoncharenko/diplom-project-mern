import React, { useEffect, useState } from 'react';
import { Transition } from 'react-transition-group';
import { formatMoney} from '../../helpers'

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

export const List = ({ items, lenders, borrowers, onOpenModal, setCurrentRepay }) => {
  const [subCategory, setSubCategory] = useState([]);
  const [isShowInfo, setIsShowInfo] = useState([]);
  const [isBorrowers, setIsBorrowers] = useState(false);


  useEffect(() => {
    if (lenders !== undefined && lenders.length > 0) {
      setSubCategory([...lenders]);
      setIsBorrowers(true);
      return;
    }

    if (borrowers !== undefined && borrowers.length > 0) {
      setSubCategory([...borrowers]);
      setIsBorrowers(false);
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

  const getSum = (outerItems, outerItem, subItems, subItem) => {
    if (outerItem.to !== undefined ) {
      if (isBorrowers) {
        if (outerItem.to[subItem.name] !== undefined) {
          return outerItem.to[subItem.name];
        }

        return 0;
      }

      if (subItem.to[outerItem.name] !== undefined) {
        return subItem.to[outerItem.name];
      }

      return 0;
    }

    if (isBorrowers) {
      if (subItem.sum >= outerItem.sum) {
        return;
      }

      return subItem.sum;
    }

    if (outerItem.sum >= subItem.sum) {
      return subItem.sum;
    }

    return outerItem.sum;
  };

  const onPayback = (event, index, subIndex) => {
    let currentBorrower = null;
    let currentLender = null;

    if (isBorrowers) {
      currentBorrower = items[index];
      currentLender = subCategory[subIndex];
    } else {
      currentBorrower = subCategory[subIndex];
      currentLender = items[index];
    }

    setCurrentRepay({
      currentBorrower,
      currentLender,
    });
    onOpenModal(event);
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
                  {formatMoney(item.sum)}
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
                    <div
                      className="expense-details__sub-list-outer">{isBorrowers ? 'Кому вернуть:' : 'Кто одолжил:'}</div>
                    <ul className="expense-details__sub-list">
                      {
                        subCategory.map((subItem, idx) => {
                          return getSum(items, item, subCategory, subItem) !== 0 && (
                            <li
                              key={idx}
                              className="expense-details__sub-item"
                            >
                              <div className="expense-details__sub-item-name">{subItem.name}</div>
                              <div className="expense-details__sub-item-sum">
                                {getSum(items, item, subCategory, subItem)}
                              </div>
                              <div className="expense-details__btn-payback">
                                <button
                                  className="btn btn--text"
                                  onClick={event => onPayback(event, index, idx)}
                                >
                                  Расчет
                                </button>
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
