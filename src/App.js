import { useEffect, useState } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './routes/Login';
import Register from './routes/Register';
import Thread from './routes/Thread';
import User from './routes/User';
import Reset from './routes/Reset';
import MainHeader from './components/MainHeader';
import CreateClass from './routes/CreateClass';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth'
import ProtectedRoute from './components/ProtectedRoute';
import UnprotectedRoute from './components/UnprotectedRoute ';
import CreatePost from './routes/CreatePost';

function App() {

  const [user, setUser] = useState({ user: null, isChecking: true });
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (curUser) => {
      setUser(prevUser => ({ user: prevUser.user, isChecking: true }));
      if (curUser !== user) {
        setUser({ user: curUser, isChecking: false });
      }
    });
    return unsubscribe;
  }, [])

  return (
    <div>
      <MainHeader user={user} />
      <main>
        <Routes>
          <Route path="/" element={<UnprotectedRoute user={user}><Login /></UnprotectedRoute>} />
          <Route path="/register" element={<UnprotectedRoute user={user}><Register /></UnprotectedRoute>} />
          <Route path="/reset" element={<UnprotectedRoute user={user}><Reset /></UnprotectedRoute>} />
          <Route path="/user" element={<ProtectedRoute user={user}><User user={user} /></ProtectedRoute>} />
          <Route path="/class/:classId/">
            <Route path="" element={<ProtectedRoute user={user}><Thread /></ProtectedRoute>} />
            <Route path="post" element={<ProtectedRoute user={user}><CreatePost /></ProtectedRoute>}></Route>
            <Route path=":postId" element={<ProtectedRoute user={user}><Thread /></ProtectedRoute>} />
          </Route>
          <Route path="/class/create" element={<ProtectedRoute user={user}><CreateClass /></ProtectedRoute>}></Route>
        </Routes>
      </main>
    </div>
  )
}

export default App;
