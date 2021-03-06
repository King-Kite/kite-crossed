import React, { useEffect, useState } from "react";
import useMap from "./hooks/useMap";
import "./App.css";

const App = () => {
  const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0,
    userAddress: null,
    error: null,
    loading: false,
  });

  const [markers, setMarkers] = useState(null);

  const { latitude, longitude } = position;

  const { map } = useMap("userMap", latitude, longitude, markers);

  const getMarkers = async () => {
    let marks = await [
      {
        latitude: 6.3345,
        longitude: 3.93,
        info: { firstName: "John", lastName: "Smith" },
      },
      {
        latitude: 5,
        longitude: 3,
        info: { firstName: "John", lastName: "Smith" },
      },
      {
        latitude: 4,
        longitude: 3,
        info: { firstName: "John", lastName: "Smith" },
      },
    ];
    setMarkers(marks);
  };

  useEffect(() => {
    getMarkers();
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
        latitude: 0,
        longitude: 0,
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
      <h2 className="header">
        HTML5 Geolocation With Leaflet and OpenStreetMap
      </h2>
      <button className="button" onClick={getLocation}>
        Get Co-ordinates
      </button>
      <h4 className="coords">HTML5 Coordinates</h4>
      <div className="latlng">
        <p>Latitude: {position.latitude}</p>
        <p>Longitude: {position.longitude}</p>
      </div>
      <h4 className="coords">Leaflet with OpenStreetMap tiles</h4>
      {/*<p className="address">Location on map: {position.userAddress}</p>*/}
      <div className="map">{map && map}</div>
    </div>
  );
};

export default App;
