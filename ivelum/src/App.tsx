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
import Search from './components/search';

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
      <div className="App__wrapper">
        <Routes>
          <Route path="/" element={<Search />} />
          <Route
            path="/:userName/:repoName"
            element={
              <div className="App__folders">
                <Folders />
              </div>
            }
          />
          <Route
            path="/:userName/:repoName/folder/*"
            element={
              <div className="App__folders">
                <Folder />
              </div>
            }
          />
          <Route
            path="/:userName/:repoName/file/*"
            element={
              <div className="App__folders">
                <File />
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
