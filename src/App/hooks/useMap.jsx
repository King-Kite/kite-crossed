import React, { useCallback, useEffect, useState } from "react";
import Leaflet from "leaflet";

const useMap = (id, latitude, longitude, markers) => {
  const [map, setMap] = useState(null);

  const createMarker = useCallback(
    (latitude, longitude, options) => {
      if (map) {
        let marker = Leaflet.marker([latitude, longitude], options).addTo(map);
        marker.on("click", () => {
          map.panTo([latitude, longitude], 23);
        });
      }
    },
    [map]
  );

  useEffect(() => {
    const attribution =
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

    const tiles = Leaflet.tileLayer(tileUrl, { attribution });

    if (map && longitude && latitude) {
      tiles.addTo(map);
    }
  }, [map, longitude, latitude]);

  useEffect(() => {
    if (map) {
      map.setView([latitude, longitude], 15);
    } else {
      setMap(
        Leaflet.map(id, {
          center: [latitude, longitude],
          zoom: 15,
        })
      );
    }
    let userIcon = Leaflet.icon({
      iconUrl: "/static/images/green-icon.png",
      iconSize: [38, 65],
      iconAnchor: [22, 94],
    });

    let options = { icon: userIcon };
    createMarker(latitude, longitude, options);
  }, [createMarker, id, latitude, longitude, map]);

  useEffect(() => {
    if (map && markers) {
      for (const marker of markers) {
        let { latitude, longitude } = marker;
        createMarker(latitude, longitude);
      }
    }
  }, [createMarker, map, markers]);

  return {
    map: <div id={id} style={{ height: "100%", width: "100%" }}></div>,
  };
};

export default useMap;
