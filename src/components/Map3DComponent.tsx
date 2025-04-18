import { useEffect, useRef } from "react";

const Google3DMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const loadMap = async () => {
      const { Map, AdvancedMarkerElement, Polygon } = await window.google.maps.importLibrary("maps");
      const { LatLng } = await window.google.maps.importLibrary("core");

      const position = new LatLng(37.7749, -122.4194); // San Francisco

      const map = new Map(mapRef.current, {
        center: position,
        zoom: 16,
        heading: 320,
        tilt: 75,
        mapId: "maps3d", // Enable 3D tiles in your Cloud Console & set here
      });

      // Add Marker
      const marker = new AdvancedMarkerElement({
        map,
        position,
        title: "Hello from SF",
      });

      // Add Polygon
      const polygonCoords = [
        { lat: 37.775, lng: -122.419 },
        { lat: 37.775, lng: -122.418 },
        { lat: 37.774, lng: -122.418 },
        { lat: 37.774, lng: -122.419 },
      ];

      const polygon = new Polygon({
        paths: polygonCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map,
      });

      // Long Press Event
      let pressTimer;
      mapRef.current.addEventListener("mousedown", (e) => {
        pressTimer = setTimeout(() => {
          const latLng = map.mouseEventToLatLng(e);
          console.log("Long press at:", latLng.toString());
          new AdvancedMarkerElement({
            map,
            position: latLng,
            title: "New Marker",
          });
        }, 1000);
      });

      mapRef.current.addEventListener("mouseup", () => {
        clearTimeout(pressTimer);
      });
    };

    if (window.google) loadMap();
  }, []);

  return <div ref={mapRef} style={{ height: "100vh", width: "100%" }} />;
};

export default Google3DMap;
