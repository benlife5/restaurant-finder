import { useState, useEffect } from 'react';
import ReactMapGL, {Marker} from 'react-map-gl';

function LocationsMap(props) {
  const locations = props.locations;
  const [viewport, setViewport] = useState();

  useEffect(() => {
    if (locations === null) return null;

    let topLeft = locations[0].geometry.location;
    let bottomRight = locations[0].geometry.location;
    for (let i = 0; i < locations.length; i++) {
      if (locations[i].geometry.location.lat < topLeft.lat || locations[i].geometry.location.lng > topLeft.lng) {
        topLeft = locations[i].geometry.location;
      }
      if (locations[i].geometry.location.lat > bottomRight.lat || locations[i].geometry.location.lng < bottomRight.lng) {
        bottomRight = locations[i].geometry.location;
      }
    }
    console.log("start", topLeft, bottomRight)
  
    const lat = (bottomRight.lat - topLeft.lat) / 2 + topLeft.lat;
    const lng = (bottomRight.lng - topLeft.lng) / 2 + topLeft.lng;
    console.log("final", lat, lng)
    setViewport({
      width: "100%",
      height: "100%",
      latitude: lat,
      longitude: lng,
      zoom: 12
    })
  }, [locations])


  if (locations === null) return null;


  return (
    <ReactMapGL
      {...viewport}
      onViewportChange={nextViewport => setViewport(nextViewport)}
    >
      {/* {locations.map((l) => alert(l.geometry.location.lat))} */}
      {locations.map((l) => 
        <Marker latitude={l.geometry.location.lat} longitude={l.geometry.location.lng} offsetLeft={-20} offsetTop={-10} key={l.key}>
          <div>{l.name}</div>
        </Marker>
      )}
 
  </ReactMapGL>
  );
}

export default LocationsMap;