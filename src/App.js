import './App.css';
import {useState} from "react";
import {Row, Col} from 'antd';
import 'antd/dist/antd.css';
import SearchInput from './SearchInput.js';
import SearchResults from './SearchResults.js';
import LocationsMap from './LocationsMap.js';

function App() {

  const [results, setResults] = useState(null);
  // console.log("TOP LEVEL", results)
  return (
    <div style={{height: "100%"}}>
      <Row style={{height: "50%"}}>
        <Col span={12}><SearchInput setResults={setResults}/></Col>
        <Col span={12}><LocationsMap locations={results}/></Col>
      </Row>
      <Row style={{height: "50%"}}>
        <Col span={24}><SearchResults locations={results}/></Col>
      </Row>
    </div>
  );
}

export default App;
