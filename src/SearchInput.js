import { Form, Input, Button } from "antd";
const axios = require('axios');
const GOOGLE_PLACES_API_KEY = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;
const GOOGLE_GEOCODING_API_KEY = process.env.REACT_APP_GOOGLE_GEOCODING_API_KEY;
const RADIUS = 10;
const getLocation = (input) => {

};

function SearchInput(props) {

  const search = (values) => {
    axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
      params: {
        key: GOOGLE_GEOCODING_API_KEY,
        address: values.location
      }
    })
    .then( (res) => {
      console.log("location", res);
      if (res.data.status === "OK") {
        return res.data.results[0].geometry.location;
      }
      else {
        console.log("NOPE")
      }
    })
    .then ( (coords) => {
      axios.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json", {
        params: {
          key: GOOGLE_PLACES_API_KEY,
          location: coords.lat + "," + coords.lng,
          radius: RADIUS,
          keyword: "restaurant OR bar"
        }
      })
      .then ( (res) => {
        console.log("results", res);
        props.setResults(res.data.results);
      })
      .catch((error) => console.log(error))
    })
    .catch((error) => console.log(error))
  };

  return (
    <div>
      SearchInput
      <Form
        onFinish={search}
      >
        <Form.Item
          label="Location"
          name="location"
        >
          <Input span={8}/>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default SearchInput;