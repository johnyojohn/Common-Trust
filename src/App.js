import logo from './logo.svg';
import { useEffect, useState } from 'react';
import './App.css';
import {Route, Routes} from 'react-router-dom';
import Login from './routes/Login';
import Register from './routes/Register';
import Thread from './routes/Thread';
import User from './routes/User';
import MainHeader from './components/MainHeader';
import Question from './routes/Question';
import {auth} from './firebase';
import {onAuthStateChanged} from 'firebase/auth'
import ProtectedRoute from './components/ProtectedRoute';
import UnprotectedRoute from './components/UnprotectedRoute ';

function App() {

  const [user, setUser] = useState({user:null, isChecking:true});
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (curUser) => {
      setUser(prevUser => ({user:prevUser.user, isChecking: true}));
      if(curUser !== user)
      {
        setUser({user:curUser, isChecking: false});
      }
    });
    return unsubscribe;
  }, [])

  useEffect(() => {
    console.log(user);
  }, [user])

  return (
    <div>
      <MainHeader user={user} />
      <main>
        <Routes>
          <Route path="/" element={<UnprotectedRoute user={user}><Login/></UnprotectedRoute>} />
          <Route path="/register" element={<UnprotectedRoute user={user}><Register/></UnprotectedRoute>} />
          <Route path="/user" element={<ProtectedRoute user={user}><User user={user} /></ProtectedRoute>} />
          <Route path="/class/:id" element={<ProtectedRoute user={user}><Thread/></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  )
}

export default App;
