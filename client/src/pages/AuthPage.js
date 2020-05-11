import React, { useContext, useEffect, useState } from "react";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";
import { AuthContext } from "../context/AuthContext";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { List } from './ExpenseDetails/list';

export const AuthPage = () => {
  const auth = useContext(AuthContext);
  const message = useMessage();

  const { loading, request, error, clearError } = useHttp();
  const [form, setForm] = useState({
    email: "", password: "", name: ""
  });

  useEffect(() => {
    message(error, 'error');
    clearError();
  }, [error, message, clearError]);

  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const registerHandler = async () => {
    try {
      const data = await request("/api/auth/register", "POST", { ...form });
      message(data.message);
      await loginHandler();
    } catch (e) {
    }
  };

  const loginHandler = async () => {
    try {
      const data = await request("/api/auth/login", "POST", { ...form });
      auth.login(data.token, data.userId);
    } catch (e) {
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__content">
        <h1 className="auth-page__title">I OWE YOU</h1>
        <form className="form auth-page__form" noValidate autoComplete="off">
          <Tabs className="expense-details__tabs">
            <TabList className="expense-details__tabs-list">
              <Tab className="expense-details__tab">Авторизация</Tab>
              <Tab className="expense-details__tab">Регистрация</Tab>
            </TabList>

            <TabPanel className="auth-page__tab-content">
              <div className="form__title">Авторизация</div>
              <div className="form__group">
                <div className="form__row">
                  <input
                    placeholder=" "
                    autoComplete="off"
                    id="email"
                    type="email"
                    name="email"
                    className="form__input"
                    value={ form.email }
                    onChange={ changeHandler }
                  />
                  <label htmlFor="email" className="form__label">Email</label>
                </div>
                <div className="form__row">
                  <input
                    placeholder=" "
                    autoComplete="new-password"
                    id="password"
                    type="password"
                    name="password"
                    className="form__input"
                    value={ form.password }
                    onChange={ changeHandler }
                  />
                  <label htmlFor="email" className="form__label">Пароль</label>
                </div>
                <div className="form__btn-group">
                  <div className="form__btn-row">
                    <button
                      className="btn form__btn"
                      disabled={ loading }
                      onClick={ loginHandler }
                    >
                      Войти
                    </button>
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel className="auth-page__tab-content">
              <div className="form__title">Регистрация</div>
              <div className="form__group">
                <div className="form__row">
                  <input
                    className="form__input"
                    placeholder=" "
                    type="text"
                    name="name"
                    value={ form.name }
                    onChange={changeHandler}
                  />
                  <label className="form__label">
                    Введите имя
                  </label>
                </div>
                <div className="form__row">
                  <input
                    placeholder=" "
                    autoComplete="off"
                    id="email"
                    type="email"
                    name="email"
                    className="form__input"
                    value={ form.email }
                    onChange={ changeHandler }
                  />
                  <label htmlFor="email" className="form__label">Email</label>
                </div>
                <div className="form__row">
                  <input
                    placeholder=" "
                    autoComplete="new-password"
                    id="password"
                    type="password"
                    name="password"
                    className="form__input"
                    value={ form.password }
                    onChange={ changeHandler }
                  />
                  <label htmlFor="password" className="form__label">Пароль</label>
                </div>
                <div className="form__row">
                  <input
                    placeholder=" "
                    id="password2"
                    type="password"
                    name="password2"
                    className="form__input"
                  />
                  <label htmlFor="password2" className="form__label">Повторите пароль</label>
                </div>
                <div className="form__btn-group">
                  <div className="form__btn-row">
                    <button
                      className="btn form__btn"
                      onClick={ registerHandler }
                      disabled={ loading }
                    >
                      Регистрация
                    </button>
                  </div>
                </div>
              </div>
            </TabPanel>
          </Tabs>
        </form>
      </div>
    </div>
  );
};
