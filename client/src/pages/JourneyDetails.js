import React, { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";
import { Loader } from "../components/Loader";
import { useMessage } from "../hooks/message.hook";
import { useHistory } from "react-router-dom";

export const JourneyDetails = () => {
  let [users, setUsers] = useState([]);
  let [user, setUser] = useState('');
  let [author, setAuthor] = useState('');
  const history = useHistory();
  const message = useMessage();

  const { token } = useContext(AuthContext);
  const { loading, request } = useHttp();

  const getAuthor = useCallback(async () => {
    try {
      const fetched = await request('/api/users/author', 'GET', null, {
        Authorization: `Bearer ${token}`
      });

      setAuthor(fetched);

    } catch (e) {
      message(e.message, 'error');
    }
  }, [token, request]);

  useEffect(() => {
    getAuthor();
  }, [getAuthor]);

  const changeHandler = (event, index) => {
    event.preventDefault();
    setUser(event.target.value);
  };

  const addUser = (event) => {
    event.preventDefault();

    if (user.length <= 0) {
      message('Введите имя', 'error');
      return;
    }

    setUsers([...users, user]);
    setUser('');
  };

  const removeUser = (index) => {
    const values = [...users];
    values.splice(index, 1);
    setUsers(values);
  };

  const saveGroup = async (e) => {
    e.preventDefault();

    try {
      const data = await request("/api/journey/users/add", "POST", { users }, {
        Authorization: `Bearer ${token}`,
      });

      message(data.message);
      history.push(`/expense`)
    } catch (e) {
      message(e.message, 'error');
    }
  };

  if (loading) {
    return <Loader/>;
  }

  return (
    <div className="journey-details">
        <div className="journey-details__content">
          <h1 className="journey-details__title">Добавление участников</h1>
          <form noValidate className="form journey-details__form">
            <div className="form__title">Здесь мы добавим всех участников между которыми делим средства</div>
            <ul className="journey-details__user-list">
              {author && <li className="journey-details__user">
                <span>👑 { author }</span>
              </li>}
              {
                users.length > 0 && users.map((item, index) =>
                  <li key={index} className="journey-details__user">
                    <span className="journey-details__user-name">{ item }</span>
                    {
                      <a className="journey-details__user-remove"
                         href="#"
                         onClick={() => removeUser(index)}
                      >✖︎</a>
                    }
                  </li>,
                )
              }
            </ul>
            <div className="form__row">
              <input
                placeholder=" "
                type="text"
                value={user}
                className="form__input"
                onChange={e => changeHandler(e)}
              />
              <label className="form__label">Введите имя</label>
            </div>
            <div className="form__btn-group">
              <div className="form__btn-row">
                <button
                  className="form__btn form__btn--white "
                  onClick={e => addUser(e)}
                >
                  Добавить пользователя
                </button>
              </div>
              <div className="form__btn-row">
                <button
                  className="form__btn"
                  onClick={e => saveGroup(e)}
                  disabled={users.length <= 0}
                >
                  Сохранить группу
                </button>
              </div>
            </div>
          </form>
        </div>
    </div>
  );
};
