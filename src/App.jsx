import { useState } from 'react'
import './App.css'
import Cookies from 'universal-cookie';

import ChatPage from './pages/Chat';
import AuthPage from './pages/Auth';

const cookies = new Cookies();

const App = () => {
  const authToken = cookies.get('token');

  return (
    <div className="app__wrapper">
      {authToken ? <ChatPage /> : <AuthPage />}
    </div>
  );
};

export default App;