import logo from './logo.svg';
import './App.css';
import {Route, Routes} from 'react-router-dom';
import Login from './routes/Login';
import Register from './routes/Register';
import Thread from './routes/Thread';
import User from './routes/User';
import MainHeader from './components/MainHeader';
import Question from './routes/Question';

function App() {
  return (
    <div>
      <MainHeader />
      <main>
        <Routes>
          <Route path="/" exact element={<Thread/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/user" element={<User/>} />
          <Route path='/questions/:id' element={<Question/>} />
        </Routes>
      </main>
    </div>
  )
}

export default App;
