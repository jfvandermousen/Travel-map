import React,{ useState, useEffect } from 'react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import mapboxgl from "mapbox-gl"
import RoomIcon from '@material-ui/icons/Room';
import StarIcon from '@material-ui/icons/Star';
import "./app.css";
import {axiosInstance} from "./config";
import {format} from "timeago.js";
import Register from './components/Register';
import Login from './components/Login';
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;


function App () {
  const myStorage = window.localStorage;
  const [currentUsername, setCurrentUsername] = useState(myStorage.getItem("user"));
  const [pins,setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle]  = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRegister,setShowRegister] = useState(false);
  const [showLogin,setShowLogin] = useState(false);


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
        const res = await axiosInstance.get("/pins");
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

  const handleSubmit = async (e)=> {
    e.preventDefault(); 
    const newPin = {
      username: currentUsername,
      title,
      desc,
      rating,
      lat:newPlace.lat,
      long:newPlace.long,
    }

    try {
      const res = await axiosInstance.post("/pins",newPin);
      setPins([...pins,res.data]);
      setNewPlace(null);

    } catch (error) {
      console.log(error)
    }
  };

  const handleLogout = () => {
    setCurrentUsername(null);
    myStorage.removeItem("user");
  };
  

  return (
    <div className="App">
      
      <ReactMapGL 
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapStyle="mapbox://styles/jfv-becode/cktbllj897z6x17phsb6648xj"
      onDblClick={currentUsername && handleAddClick}
      transitionDuration ="200"
      >
      
      {pins.map((p)=> (
        < >
      <Marker latitude={p.lat} longitude={p.long} offsetLeft={-viewport.zoom * 2.5} offsetTop={-viewport.zoom * 5}>
        <RoomIcon 
        style={{
          fontSize:viewport.zoom * 5,
          color: currentUsername === p.username ? "tomato" : "slateblue",
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
            {Array(p.rating).fill(<StarIcon className="star" />)}
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
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input placeholder="Enter a title" 
                onChange={(e)=>setTitle(e.target.value)}/>
                <label>Review</label>
                <textarea placeholder="Say a word about this place" 
                onChange={(e)=>setDesc(e.target.value)}/>
                <label>Rating</label>
                <select onChange={(e)=>setRating(e.target.value)}>
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
        {currentUsername ?  (<button className="button logout" onClick={handleLogout}>Log out</button>) : (        <div className="buttons">
        <button className="button login" 
        onClick={()=>setShowLogin(true)}>
          Login</button>

        <button className="button register" 
        onClick={()=>setShowRegister(true)}>Register</button>
        </div>)}
        
        {showRegister && (
            <Register setShowRegister={setShowRegister}/>

        )}
        {showLogin && (
            <Login 
            setShowLogin={setShowLogin}
            setCurrentUsername={setCurrentUsername}
            myStorage={myStorage}
            />

        )}
        
      </ReactMapGL>
    </div>
  );
}

export default App;
