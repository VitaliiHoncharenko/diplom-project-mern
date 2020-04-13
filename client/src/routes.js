import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { AnimatedSwitch } from 'react-router-transition';

import { LinksPage } from './pages/LinksPage'
import { DetailPage } from './pages/DetailPage'
import { AuthPage } from './pages/AuthPage';
import { AddName } from './pages/AddName';
import { NewJourney } from './pages/NewJourney';
import { NewExpense } from './pages/NewExpense';
import { JourneyDetails } from './pages/JourneyDetails';

export const useRoutes = isAuthenticated => {
  if (isAuthenticated) {
    return (
        <AnimatedSwitch
          atEnter={{ opacity: 0 }}
          atLeave={{ opacity: 0 }}
          atActive={{ opacity: 1 }}
          className="app__switcher"
        >
          <Route path="/name" exact>
            <AddName/>
          </Route>
          <Route path="/journey" exact>
            <NewJourney/>
          </Route>
          <Route path="/expense" exact>
            <NewExpense/>
          </Route>
          <Route path="/journey/details" exact>
            <JourneyDetails/>
          </Route>
          <Route path="/detail/:id">
            <DetailPage/>
          </Route>
          <Redirect to="/name"/>
        </AnimatedSwitch>
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
