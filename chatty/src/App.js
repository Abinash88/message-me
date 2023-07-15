import './App.css';
import {useState, useEffect} from 'react';
import io from 'socket.io-client';
import {BrowserRouter as Router, Route, Routes, BrowserRouter} from 'react-router-dom';
import {nanoid} from 'nanoid';
import Join from './component/Join/Join';
import Chat from './component/Chat/Chat';
import {Toaster} from 'react-hot-toast'

//no dotenv
const socket = io.connect('http://localhost:5000', {transports:['websocket']});
const userName = nanoid(4);

function App() {



  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
            <Route exact path='/' element={<Join/>}/>
            <Route path='/Chat' element={<Chat/>}/>
        </Routes>
      </BrowserRouter>
      <Toaster/>
    </div>
  );
}

export default App;
