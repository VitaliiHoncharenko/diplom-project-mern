import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import {
  TransitionGroup,
  CSSTransition
} from "react-transition-group";

import { AuthPage } from './pages/AuthPage';
import { AddName } from './pages/AddName';
import { NewJourney } from './pages/NewJourney';
import { NewExpense } from './pages/NewExpense';
import { JourneyDetails } from './pages/JourneyDetails';
import { ExpensesPage } from './pages/ExpensesPage';
import { ExpenseDetails } from './pages/ExpenseDetails';

export const useRoutes = isAuthenticated => {
  if (isAuthenticated) {
    return (
      <Route render={({ location }) => (
        <TransitionGroup className="app__switcher">
          <CSSTransition
            key={location.key}
            classNames="app__page-"
            timeout={300}
          >
          <Switch location={location}>
            <Route path="/name" exact>
              <AddName/>
            </Route>
            <Route path="/journey" exact>
              <NewJourney/>
            </Route>
            <Route path="/expense/create" exact>
              <NewExpense/>
            </Route>
            <Route path="/journey/details" exact>
              <JourneyDetails/>
            </Route>
            <Route path="/expense/list" exact>
              <ExpensesPage/>
            </Route>
            <Route path="/expense/:id">
              <ExpenseDetails/>
            </Route>
            <Redirect to="/expense/list"/>
          </Switch>
          </CSSTransition>
        </TransitionGroup>
      )}/>
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
