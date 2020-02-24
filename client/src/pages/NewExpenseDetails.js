import React, { useState } from 'react'

export const NewExpenseDetails = () => {
  const [name, setName] = useState('');
  let [users, setUser] = useState(['']);

  const changeHandler = (event, index) => {
    const values = [...users];
    values[index] = event.target.value

    setUser(values);
  }

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


  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <div className="card brown darken-2">
          <div className="card-content white-text">
            <span className="card-title">Здесь мы добавим всех участников между которыми делим средства</span>
            <div>
              <ul>
                {
                  users.map((item, index) =>
                    <li key={index}>
                      <label htmlFor="name">Добавить пользователя</label>
                      <input
                        placeholder="Введите имя"
                        type="text"
                        className="waves-button-input"
                        value={item}
                        onChange={e => changeHandler(e, index)}
                      />
                      {index !== 0 && <a href="#" onClick={() => removeUser(index)}>X</a>}
                    </li>
                  )
                }
              </ul>
            </div>
          </div>
          <div className="card-action">
            <button
              className="btn black darken-4"
              onClick={e => addUser(e)}
            >
              Добавить
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
