import React,{useState} from 'react';
//import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Home from './Components/Home'
import Option from './Components/Option'

function App() {
  const [key, setKey] = useState('home'); 

    return (
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
      >
        <Tab eventKey="home" title="Home"> 
          <Home />
        </Tab>
        <Tab eventKey="stocks" title="Stocks">
          <Option />
        </Tab>
      </Tabs>
    );
}

export default App;
