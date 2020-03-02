import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { LinksPage } from './pages/LinksPage'
import { DetailPage } from './pages/DetailPage'
import { AuthPage } from './pages/AuthPage';
import { AddName } from './pages/AddName';
import { NewJourney } from './pages/NewJourney';
import { NewExpense } from './pages/NewExpense';
import { NewExpenseDetails } from './pages/NewExpenseDetails';

export const useRoutes = isAuthenticated => {
  if (isAuthenticated) {
    return (
      <Switch>
        <Route path="/name" exact>
          <AddName/>
        </Route>
        <Route path="/journey" exact>
          <NewJourney/>
        </Route>
        <Route path="/expense" exact>
          <NewExpense/>
        </Route>
        <Route path="/expense/details" exact>
          <NewExpenseDetails/>
        </Route>
        <Route path="/detail/:id">
          <DetailPage/>
        </Route>
        <Redirect to="/name"/>
      </Switch>
    )
  }

  return (
    <Switch>
      <Route path="/" exact>
        <AuthPage/>
      </Route>
      <Redirect to="/"/>
    </Switch>
  )
}
