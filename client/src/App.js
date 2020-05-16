import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useRoutes } from './routes';
import { useAuth } from './hooks/auth.hook';
import { AuthContext } from './context/AuthContext';
import { Loader } from './components/Loader';
import { ToastContainer } from 'react-toastify';

function App() {
  const { token, login, logout, userId, ready } = useAuth();
  const isAuthenticated = !!token;
  const routes = useRoutes(isAuthenticated);

  if (!ready) {
    return <Loader/>;
  }

  return (
    <>
      <AuthContext.Provider value={{
        token, login, logout, userId, isAuthenticated,
      }}>
        <Router>
          {/*{isAuthenticated && <Navbar/>}*/}
          <div className="app__body">
            {routes}
          </div>
        </Router>
      </AuthContext.Provider>
      <ToastContainer
        hideProgressBar
        autoClose={3000}
        closeOnClick
      />
    </>
  );
}

export default App;
