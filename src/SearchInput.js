import { Form, Button, InputNumber, Select, Checkbox, AutoComplete } from "antd";
import { useState } from 'react';
const { Option } = Select;
const axios = require('axios');
const GOOGLE_PLACES_API_KEY = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;
const GOOGLE_GEOCODING_API_KEY = process.env.REACT_APP_GOOGLE_GEOCODING_API_KEY;
const MILE_TO_METER = 1609.34;

function SearchInput(props) {
  const [options, setOptions] = useState([]);

  const autoComplete = (searchInput) => {
    axios.get("https://maps.googleapis.com/maps/api/place/autocomplete/json", {
      params: {
        key: GOOGLE_PLACES_API_KEY,
        input: searchInput
      }
    })
    .then((res) => {
      console.log("prediction: ", res);
      const predictions = res.data.predictions.map(prediction => {return {value: prediction.description}});
      setOptions(predictions);
    })
    .catch((error) => console.log(error));
  }

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
      console.log("location", geocodeLocation);
      if (geocodeLocation.data.status === "OK") {
        props.setInputCoords(geocodeLocation.data.results[0].geometry.location);
        return geocodeLocation.data.results[0].geometry.location;
      }
      else {
        console.log("Error:", geocodeLocation)
      }
    }) 
    // Main search for places 
    .then ((coords) => {
      // console.log(searchInput);
      let searchParams = {
        key: GOOGLE_PLACES_API_KEY,
        location: coords.lat + "," + coords.lng,
        radius: (parseInt(searchInput.radius) * MILE_TO_METER),
        type: searchInput.type,
      }
      if (searchInput.open)  searchParams["opennow"] = "";
      
      axios.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json", {
        params: searchParams 
      })
      // Get desired info about all places
      .then((locations) => {
        console.log("results", locations);
          Promise.all(
            locations.data.results.map( async (location) => {
              let info = await axios.get("https://maps.googleapis.com/maps/api/place/details/json", {
                params: {
                  key: GOOGLE_PLACES_API_KEY,
                  place_id: location.place_id,
                  fields: "formatted_address,name,formatted_phone_number,website,price_level,rating,place_id,geometry"
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
    <div style={{marginRight: "2%", backgroundColor: "#f9f9f9", height: "100%", padding: "2%"}}>
      <Form onFinish={search} initialValues={{type: "restaurant", radius: 5}} layout="horizontal">
        <Form.Item label="Location" name="location">
          <AutoComplete options={options} onSearch={autoComplete} /> 
        </Form.Item>

        <div style={{display: "flex", flexDirection: "row", gap: "2%", justifyContent: "space-between"}}>
          <Form.Item label="Radius (mi)" name="radius"> 
            <InputNumber />
          </Form.Item>

          <Form.Item label="Open Now" valuePropName="checked" name="open" style={{textAlign: "center"}}>
            <Checkbox options={[{value: true}]}/>
          </Form.Item>
          

          <Form.Item label="Type" name="type"> 
            <Select name="type" style={{width: "9em"}}>
              <Option value="restaurant">Restaurant</Option>
              <Option value="bar">Bar</Option>
              <Option value="cafe">Cafe</Option>
              <Option value="bakery">Bakery</Option>
              <Option value="supermarket">Supermarket</Option>
              <Option value="pharmacy">Pharmacy</Option>
              <Option value="park">Park</Option>
              <Option value="gas_station">Gas Station</Option>
              <Option value="store">Store</Option>

            </Select>
          </Form.Item>
        </div>

        <Form.Item style={{textAlign: "center"}}>
          <Button type="primary" htmlType="submit" style={{width: "75%"}}> Search </Button> 
        </Form.Item>
      </Form>
    </div>
  );
}

export default SearchInput;