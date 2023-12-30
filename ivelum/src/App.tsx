import React, { useEffect, useRef } from 'react';
import logo from './logo.svg';
import './styles/App.scss';
import Typed from 'typed.js';
import UserInfo from './components/user-info';
import Folders from './components/folders';
import { Link, Route, Routes } from 'react-router-dom';
import Folder from './components/folder';
import File from './components/file';
import Snowfall from 'react-snowfall';

function App() {
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ['Cool Github explorer'],
      typeSpeed: 50,
      showCursor: false,
    });

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div className="App">
      <Snowfall />
      <header className="App__header">
        <Link to="/">
          <div className="App__enter">
            <img src={logo} className="App__logo" alt="logo" />
            <div className="App__enter-text" ref={el}></div>
          </div>
        </Link>

        <div className="App__user">
          <UserInfo />
        </div>
      </header>
      <div className="App__folders">
        <Routes>
          <Route path="/" element={<Folders />} />
          <Route path="/:repoName/folder/*" element={<Folder />} />
          <Route path="/:repoName/file/*" element={<File />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
