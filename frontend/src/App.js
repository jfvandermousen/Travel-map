import React,{ useState } from 'react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import RoomIcon from '@material-ui/icons/Room';
import StarIcon from '@material-ui/icons/Star';


function App() {
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 49.52898106094565, 
    longitude: -1.5250995137159866,
    zoom: 8
  });
  const [showPopup, togglePopup] = React.useState(false);
  

  return (
    <div className="App">
      <ReactMapGL 
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapStyle="mapbox://styles/jfv-becode/cktbllj897z6x17phsb6648xj"
      >
      
      
      <Marker latitude={49.67246935345207} longitude={-1.9400402058871986} offsetLeft={-20} offsetTop={-30}>
        <RoomIcon color="primary" style={{fontSize:viewport.zoom * 3}} />
      </Marker>
      <Popup
          latitude={49.67246935345207}
          longitude={-1.9400402058871986}
          closeButton={true}
          closeOnClick={false}
           onClose={() => togglePopup(false)}
          anchor="bottom-left" >
          <div className="card">
            <label>Place</label>
            <h4>Nez de Jobourg</h4>
            <label>Reviews</label>
            <p>Beautiful falaises</p>
            <label>Rating</label>
            <StarIcon />
            <StarIcon />
            <StarIcon />
            <StarIcon />
            <StarIcon />
            <label>Infos</label>
          </div>
        </Popup>
      </ReactMapGL>
    </div>
  );
}

export default App;
