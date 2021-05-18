import { Form, Input, Button } from "antd";
const axios = require('axios');
const GOOGLE_PLACES_API_KEY = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;
const GOOGLE_GEOCODING_API_KEY = process.env.REACT_APP_GOOGLE_GEOCODING_API_KEY;
const RADIUS = 10;

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
        let finalResults = [];
        for (let i = 0; i < res.data.results.length; i++) {
          axios.get("https://maps.googleapis.com/maps/api/place/details/json", {
            params: {
              key: GOOGLE_PLACES_API_KEY,
              place_id: res.data.results[i].place_id,
              fields: "formatted_address,name,formatted_phone_number,website,price_level,rating"
            }
          })
          .then((individualRes) => {
            console.log(i, individualRes);
            finalResults.splice(i, 0, individualRes.data.result);
            if (i === res.data.results.length - 1) {
              props.setResults(finalResults);
            }
          })
          .catch((error) => console.log(error))
        }
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