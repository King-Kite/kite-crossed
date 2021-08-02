import React, { useEffect, useState } from "react";
import Leaflet from "leaflet";
import "./App.css";

const App = () => {
  const [position, setPosition] = useState({
    latitude: null,
    longitude: null,
    userAddress: null,
    error: null,
    loading: false,
  });
  const [map, setMap] = useState(null);

  useEffect(() => {
    let { latitude, longitude } = position;
    if (latitude && longitude) {
      let map = Leaflet.map("map", {
        center: [latitude, longitude],
        zoom: 13,
      });
      setMap(map);
    }
  }, [position]);

  const getCoordinates = (location) => {
    const { latitude, longitude } = location.coords;

    setPosition({
      latitude,
      longitude,
      userAddress: null,
      error: null,
      loading: false,
    });
  };

  const handleLocationError = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        setPosition({
          error: "User denied the request for Geolocation.",
          loading: false,
        });
        break;
      case error.POSITION_UNAVAILABLE:
        setPosition({
          error: "Location information is unavailable.",
          loading: false,
        });
        break;
      case error.TIMEOUT:
        setPosition({
          error: "The request to get user location timed out.",
          loading: false,
        });
        break;
      case error.UNKNOWN_ERROR:
        setPosition({ error: "An unknown error occurred.", loading: false });
        break;
      default:
        setPosition({ error: "An unknown error occurred.", loading: false });
        break;
    }
  };

  const getLocation = () => {
    setPosition({
      ...position,
      error: null,
      loading: true,
    });
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        getCoordinates,
        handleLocationError
      );
    } else {
      setPosition({
        latitude: null,
        longitude: null,
        userAddress: null,
        error: "Your Browser Does Not Support HTML5 GeoLocation",
        loading: false,
      });
    }
  };

  return (
    <div className="container">
      {position.loading && <div className="loading" />}
      {position.error && <p className="error">Error: {position.error} </p>}
      <h2 className="header">React Geolocation Example</h2>
      <button className="button" onClick={getLocation}>
        Get Co-ordinates
      </button>
      <h4 className="coords">HTML5 Coordinates</h4>
      <div className="latlng">
        <p>Latitude: {position.latitude}</p>
        <p>Longitude: {position.longitude}</p>
      </div>
      <h4 className="coords">Google Maps Reverse Geocoding</h4>
      <p className="address">Address: {position.userAddress}</p>
      <div className="map">
        {map && <div id="map" style={{ height: "100%", width: "100%" }}></div>}
      </div>
    </div>
  );
};

export default App;
