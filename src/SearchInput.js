import { Form, Input, Button } from "antd";
const axios = require('axios');
const GOOGLE_PLACES_API_KEY = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;
const GOOGLE_GEOCODING_API_KEY = process.env.REACT_APP_GOOGLE_GEOCODING_API_KEY;
const RADIUS = 1600 * 5;

function SearchInput(props) {

  const search = (searchInput) => {
    axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
      params: {
        key: GOOGLE_GEOCODING_API_KEY,
        address: searchInput.location
      }
    })
    .then((geocodeLocation) => {
      console.log("location", geocodeLocation);
      if (geocodeLocation.data.status === "OK") {
        return geocodeLocation.data.results[0].geometry.location;
      }
      else {
        console.log("Error:", geocodeLocation)
      }
    })
    .then ((coords) => {
      axios.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json", {
        params: {
          key: GOOGLE_PLACES_API_KEY,
          location: coords.lat + "," + coords.lng,
          radius: RADIUS,
          type: "restaurant",
          opennow: "true"
        }
      })
      .then((locations) => {
        console.log("results", locations);
        console.log("inputLocations", locations.data.results);

          Promise.all(
            locations.data.results.map( async (location) => {
              let info = await axios.get("https://maps.googleapis.com/maps/api/place/details/json", {
                params: {
                  key: GOOGLE_PLACES_API_KEY,
                  place_id: location.place_id,
                  fields: "formatted_address,name,formatted_phone_number,website,price_level,rating"
                }
              })
              .catch((error) => console.log(error))
              return info.data.result;
          })
        )
        .then((finalLocations) => {
          console.log("outputLocations", finalLocations)
          props.setResults(finalLocations);
        })
        .catch((error) => console.log(error))
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