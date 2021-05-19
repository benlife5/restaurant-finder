import { Form, Input, Button, InputNumber, Select, Checkbox } from "antd";
const { Option } = Select;
const axios = require('axios');
const GOOGLE_PLACES_API_KEY = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;
const GOOGLE_GEOCODING_API_KEY = process.env.REACT_APP_GOOGLE_GEOCODING_API_KEY;
const MILE_TO_METER = 1609.34;

function SearchInput(props) {

  // Main Search Function
  const search = (searchInput) => {
    // console.log(searchInput)
    // Convert input to geo location
    axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
      params: {
        key: GOOGLE_GEOCODING_API_KEY,
        address: searchInput.location
      }
    })
    // Convert location to coordinates
    .then((geocodeLocation) => {
      // console.log("location", geocodeLocation);
      if (geocodeLocation.data.status === "OK") {
        return geocodeLocation.data.results[0].geometry.location;
      }
      else {
        console.log("Error:", geocodeLocation)
      }
    }) 
    // Main search for places 
    // TODO: fix the opennow parameter
    .then ((coords) => {
      // console.log(searchInput);
      
      axios.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json", {
        params: {
          key: GOOGLE_PLACES_API_KEY,
          location: coords.lat + "," + coords.lng,
          radius: (parseInt(searchInput.radius) * MILE_TO_METER),
          type: searchInput.type,
          opennow: (searchInput.open? "true" : "dskfjaklsdjfaljldfksa")
        }
      })
      // Get desired info about all places
      .then((locations) => {
        // console.log("results", locations);
        // console.log("inputLocations", locations.data.results);

          Promise.all(
            locations.data.results.map( async (location) => {
              let info = await axios.get("https://maps.googleapis.com/maps/api/place/details/json", {
                params: {
                  key: GOOGLE_PLACES_API_KEY,
                  place_id: location.place_id,
                  fields: "formatted_address,name,formatted_phone_number,website,price_level,rating,place_id"
                }
              })
              .catch((error) => console.log(error))
              return info.data.result;
          })
        )
        // Update app 
        .then((finalLocations) => {
          // console.log("outputLocations", finalLocations)
          finalLocations.map((location) => location["key"] = location["place_id"]);  // Needed for react
          props.setResults(finalLocations);
        })
        // Error handling
        .catch((error) => console.log(error))
      })
      .catch((error) => console.log(error))
    })
    .catch((error) => console.log(error))
  };

  return (
    <div>
      SearchInput
      <Form onFinish={search} initialValues={{type: "restaurant", radius: 5}} layout="inline">
        <Form.Item label="Location" name="location">
          <Input /> 
        </Form.Item>

        <Form.Item label="Radius (mi)" name="radius"> 
          <InputNumber />
        </Form.Item>

        <Form.Item label="Open Now" valuePropName="checked" name="open">
          <Checkbox options={[{value: true}]}/>
        </Form.Item>
        

        <Form.Item label="Type" name="type"> 
          <Select name="type">
            <Option value="restaurant">Restaurant</Option>
            <Option value="bar">Bar</Option>
            <Option value="cafe">Cafe</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit"> Search </Button> 
        </Form.Item>
      </Form>
    </div>
  );
}

export default SearchInput;