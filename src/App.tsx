import React, { useState } from "react";
// import { Map } from './components/Map';
import { Map3D } from "./components/Map3D";
import Google3DMap from "./components/Map3DComponent";
import { Map } from "./components/Map";

function App() {
  const [markers, setMarkers] = useState<
    {
      lat: number;
      lng: number;
      title: string;
    }[]
  >([
    { lat: 40.7144, lng: -74.0208, title: "1000" },
    { lat: 40.6993, lng: -74.019, title: "1001" },
    { lat: 40.7035, lng: -74.0004, title: "1002" },
    { lat: 40.7144, lng: -74.0208, title: "1003" },
  ]);
  return (
    <div className="h-screen w-full">
      <Map3D center="New York, NY" markers={markers} setMarkers={setMarkers}/>
      {/* <Map center="New York, NY" /> */}
      {/* <Google3DMap /> */}
    </div>
  );
}

export default App;
