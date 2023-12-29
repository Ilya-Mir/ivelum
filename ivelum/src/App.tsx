import React from 'react';
import logo from './logo.svg';
import './styles/App.scss';
import {useQuery} from "@apollo/client";
import {REPO_FILE, REPO_QUERY, TEST_QUERY} from "./graphql/queries/repo";

function App() {
  const { loading, error, data } = useQuery(TEST_QUERY);
  const { data: data2 } = useQuery(REPO_QUERY);
  const { data: data3 } = useQuery(REPO_FILE);

  console.warn(data);
  console.warn(data2);
  console.warn(data3, 'data3');
  return (
    <div className="App">
      <header className="App__enter">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="App__enter-text">
          Cool&nbsp;<code>Github</code>&nbsp;explorer
        </div>
      </header>
    </div>
  );
}

export default App;
