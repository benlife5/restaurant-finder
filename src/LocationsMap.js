import { useState, useEffect } from 'react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';

function LocationsMap(props) {
  const locations = props.locations;
  const [viewport, setViewport] = useState();
  const [activePopup, setActivePopup] = useState();

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
    // console.log("start", topLeft, bottomRight)
  
    const lat = (bottomRight.lat - topLeft.lat) / 2 + topLeft.lat;
    const lng = (bottomRight.lng - topLeft.lng) / 2 + topLeft.lng;
    // console.log("final", lat, lng)
    setViewport({
      width: "100%",
      height: "100%",
      latitude: lat,
      longitude: lng,
      zoom: 12,
      style: {mapbox:'//styles/mapbox/streets-v11'}
    })
  }, [locations])

  if (locations === null) {
    return <div style={{width: "100%", height: "100%", backgroundColor: "#f9f9f9", display: "flex", alignItems: "center", justifyContent: "center"}}>Enter an address to begin</div>;
  }
  return (
    <ReactMapGL
      {...viewport}
      onViewportChange={nextViewport => setViewport(nextViewport)}
    >
      {locations.map((l) => 
        <Marker latitude={l.geometry.location.lat} longitude={l.geometry.location.lng} offsetLeft={-20} offsetTop={-10} key={l.key}>
          <img src="https://img.icons8.com/color/16/000000/marker--v1.png" alt="Red marker" onClick={() => {setActivePopup(l)}} />
        </Marker>
      )}
      {activePopup && (
        <Popup tipSize={5} anchor="top" longitude={activePopup.geometry.location.lng} latitude={activePopup.geometry.location.lat} onClose={setActivePopup} closeOnClick={false}>
          <a href={"#" + activePopup.name.replaceAll(" ", "-")}>{activePopup.name}</a>
          {/* <a href={"https://google.com"}>{activePopup.name}</a> */}
        </Popup>
      )}
 
  </ReactMapGL>
  );
}

export default LocationsMap;