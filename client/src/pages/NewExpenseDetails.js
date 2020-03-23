import React, { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";
import { Loader } from "../components/Loader";

export const NewExpenseDetails = () => {
  const [name, setName] = useState("");
  let [users, setUser] = useState([""]);
  let [currentUser, setCurrentUser] = useState('');
  const { token } = useContext(AuthContext);
  const { loading, request } = useHttp();

  const getUsername = useCallback(async () => {
    try {
      const fetched = await request('/api/users/author', 'GET', null, {
        Authorization: `Bearer ${token}`
      })
      setCurrentUser(fetched)

    } catch (e) {}
  }, [token, request])

  useEffect(() => {
    getUsername()
  }, [getUsername])

  const changeHandler = (event, index) => {
    const values = [...users];
    values[index] = event.target.value;

    setUser(values);
  };

  const addUser = (event) => {
    const values = [...users];
    values.push(event.target.value);
    setUser(values);
  };

  const removeUser = (index) => {
    const values = [...users];
    values.splice(index, 1);
    setUser(values);
  };

  const saveGroup = async () => {
    try {
      const data = await request("/api/journey/users/add", "POST", { users }, {
        Authorization: `Bearer ${ token }`,
      });

    } catch (e) {}
  };

  if (loading) {
    return <Loader/>
  }

  return (
    <div className="row">
      <div className="col s12">
        <div className="card brown darken-2">
          <div className="card-content white-text">
            <span className="card-title">Здесь мы добавим всех участников между которыми делим средства</span>
            <div>
              <div className="waves-button-input white-text">{currentUser} (автор группы)</div>
              <ul>
                {
                  users.map((item, index) =>
                    <li key={ index }>
                      <label htmlFor="name">Добавить пользователя</label>
                      <input
                        placeholder="Введите имя"
                        type="text"
                        className="waves-button-input white-text"
                        value={ item }
                        onChange={ e => changeHandler(e, index) }
                      />
                      { index !== 0 && <a href="#" onClick={ () => removeUser(index) }>X</a> }
                    </li>,
                  )
                }
              </ul>
            </div>
          </div>
          <div className="card-action">
            <button
              className="btn black darken-4"
              onClick={ e => addUser(e) }
            >
              Добавить
            </button>
            <button
              className="btn green darken-1"
              onClick={ saveGroup }
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
