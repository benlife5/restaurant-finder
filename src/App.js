import './App.css';
import {Row, Col} from 'antd';
import 'antd/dist/antd.css';
import SearchInput from './SearchInput.js';
import SearchResults from './SearchResults.js';
import LocationsMap from './LocationsMap.js';

function App() {
  return (
    <div style={{height: "100%"}}>
      <Row style={{height: "50%"}}>
        <Col span={12}><SearchInput /></Col>
        <Col span={12}><SearchResults /></Col>
      </Row>
      <Row style={{height: "50%"}}>
        <Col span={24}><LocationsMap /></Col>
      </Row>
    </div>
  );
}

export default App;
