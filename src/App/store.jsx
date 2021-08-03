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
  const [markers, setMarkers] = useState(null);
  const [currentMarker, setCurrentMarker] = useState(null);

  const getMarkers = async () => {
    setMarkers([
      {
        latitude: 12,
        longitude: 13,
        info: { firstName: "John", lastName: "Smith" },
      },
      {
        latitude: 10,
        longitude: 9,
        info: { firstName: "John", lastName: "Smith" },
      },
      {
        latitude: 17,
        longitude: 12,
        info: { firstName: "John", lastName: "Smith" },
      },
    ]);
  };

  const createMarker = (latitude, longitude, options) => {
    let marker = Leaflet.marker([latitude, longitude], options).addTo(map);

    marker.on("click", () => {
      setCurrentMarker(marker);
      map.panTo([latitude, longitude], 13);
    });
  };

  useEffect(() => {
    let { latitude, longitude } = position;
    if (latitude && longitude) {
      let map = Leaflet.map("map", {
        center: [latitude, longitude],
        zoom: 13,
      });
      setMap(map);
    }
    getMarkers();

    if (map) {
      markers?.foreach((marker) => {
        let options = {
          riseOnHover: true,
        };

        createMarker(marker.latitude, marker.longitude, options);
      });
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
