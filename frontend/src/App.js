import React,{ useState, useEffect } from 'react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import RoomIcon from '@material-ui/icons/Room';
import StarIcon from '@material-ui/icons/Star';
import "./app.css";
import axios from "axios";
import {format} from "timeago.js";


function App() {
  const currentUser = "jf"
  const [pins,setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 49.52898106094565, 
    longitude: -1.5250995137159866,
    zoom: 8
  });
useEffect(() => {
    const getPins = async ()=>{
      try {
        const res = await axios.get("/pins");
        setPins(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getPins();
  }, [])

  const handleMarkerClick = (id,lat,long) => {
    setCurrentPlaceId(id);
    setViewport({...viewport,latitude:lat,longitude:long})
  }
  const handleAddClick = (e) => {
    const [long,lat] = e.lngLat;
    setNewPlace({
      lat,
      long,
    })
  };

  // const [showPopup, togglePopup] = React.useState(false);
  

  return (
    <div className="App">
      <ReactMapGL 
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapStyle="mapbox://styles/jfv-becode/cktbllj897z6x17phsb6648xj"
      onDblClick = {handleAddClick}
      transitionDuration ="200"
      >
      
      {pins.map(p=>(
        <>
      
      <Marker latitude={p.lat} longitude={p.long} offsetLeft={-20} offsetTop={-30}>
        <RoomIcon 
        style={{
          fontSize:viewport.zoom * 3,
          color: p.username===currentUser ? "tomato" : "purple",
          cursor:"pointer"}}
          onClick={()=>handleMarkerClick(p._id,p.lat,p.long)}
           />
      </Marker>
      {p._id === currentPlaceId && (
      
      <Popup
          latitude={p.lat}
          longitude={p.long}
          closeButton={true}
          closeOnClick={false}
           onClose={() => setCurrentPlaceId(null)}
          anchor="bottom-left"
           >
          <div className="card">
            <label>Place</label>
            <h4 className="place">{p.title}</h4>
            <label>Review</label>
            <p className="desc">{p.desc}</p>
            
            
            <label>Rating</label>
            <div className="stars">
            <StarIcon className="star" />
            <StarIcon className="star" />
            <StarIcon className="star" />
            <StarIcon className="star" />
            <StarIcon className="star" />
            </div>
            <label>Infos</label>
            <span className="username">Created by <b>{p.username}</b></span>
            <span className="date">{format(p.createdAt)}</span>
          </div>
        </Popup>
        )}
        </>
        ))}
        {newPlace &&
        
              <Popup
          latitude={newPlace.lat}
          longitude={newPlace.long}
          closeButton={true}
          closeOnClick={false}
          onClose={() => setNewPlace(null)}
          anchor="bottom-left">
            <div>
              <form>
                <label>Title</label>
                <input placeholder="Enter a title"/>
                <label>Review</label>
                <textarea placeholder="Say a word about this place"/>
                <label>Rating</label>
                <select>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  
                  </select> 
                <button className="submiButton" type="submit">Add Pin</button>
              </form>
            </div>
        </Popup>
        }
      </ReactMapGL>
    </div>
  );
}

export default App;
