import React, { useEffect, useRef, useState } from "react";

interface Map3DProps {
  center: string;
  markers: { lat: number; lng: number; title: string }[];
  setMarkers: (markers: { lat: number; lng: number; title: string }[]) => void;
}

interface DialogProps {
  marker: { lat: number; lng: number; title: string };
  onClose: () => void;
}

const MarkerDialog: React.FC<DialogProps> = ({ marker, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-2">{marker.title}</h2>
        <div className="mb-4">
          <p>Latitude: {marker.lat}</p>
          <p>Longitude: {marker.lng}</p>
        </div>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export function Map3D({ center, markers, setMarkers }: Map3DProps) {
  const [polygon, setPolygon] = useState(false);
  const [markerVisible, setMarkerVisible] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState<{
    lat: number;
    lng: number;
    title: string;
  } | null>(null);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const mapRef = useRef<HTMLElement | null>(null);
  const longPressTimer = useRef<number | null>(null);

  // Function to handle marker clicks
  const handleMarkerClick = (marker: {
    lat: number;
    lng: number;
    title: string;
  }) => {
    console.log("Marker clicked:", marker);
    setSelectedMarker(marker);
  };

  const handleLongPressStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (longPressTimer.current) return;

    longPressTimer.current = setTimeout(() => {
      const mapElement = mapRef.current;
      if (!mapElement) return;

      // Get the click coordinates relative to the map
      const rect = mapElement.getBoundingClientRect();
      const x =
        "touches" in e
          ? e.touches[0].clientX - rect.left
          : e.clientX - rect.left;
      const y =
        "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

      // Convert screen coordinates to lat/lng
      // This is a simplified conversion - you might want to use the Google Maps API for more accurate conversion
      const lat = coordinates!.lat + (y - rect.height / 2) * 0.0001;
      const lng = coordinates!.lng + (x - rect.width / 2) * 0.0001;

      // Add a new marker at the long press location
      const newMarker = {
        lat,
        lng,
        title: `Marker ${markers.length + 1}`,
      };
      console.log(newMarker, "newMarker");
      const newMarkers = [...markers, newMarker];
      setMarkers([...newMarkers]);
    }, 500); // 500ms for long press
  };

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  useEffect(() => {
    if (window.google) {
      const geocoder = new google.maps.Geocoder();

      geocoder.geocode({ address: center }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const location = results[0].geometry.location;
          setCoordinates({
            lat: location.lat(),
            lng: location.lng(),
          });
        }
      });
    }
  }, [center]);

  useEffect(() => {
    const polygonSelector = document.querySelector("gmp-polygon-3d");

    async function initPolygon() {
      if (!polygonSelector) return;

      try {
        await google.maps.importLibrary("maps3d");
        // Handle the polygon element type
        if (polygonSelector) {
          // Cast to unknown first to avoid TypeScript errors
          const typedElement = polygonSelector as unknown as {
            outerCoordinates: { lat: number; lng: number; altitude: number }[];
          };

          typedElement.outerCoordinates = [
            { lat: 40.7144, lng: -74.0208, altitude: 1000 },
            { lat: 40.6993, lng: -74.019, altitude: 1000 },
            { lat: 40.7035, lng: -74.0004, altitude: 1000 },
            { lat: 40.7144, lng: -74.0208, altitude: 1000 },
          ];
        }
      } catch (error) {
        console.error("Error initializing polygon:", error);
      }
    }

    if (polygon) {
      initPolygon();
    }
  }, [polygon]);

  // Add gmp-click event listeners when markers are mounted
  useEffect(() => {
    async function setupMarkerListeners() {
      console.log("Setting up marker listeners...");
      const interactiveMarkers = document.querySelectorAll(
        "gmp-marker-3d-interactive"
      );
      console.log("Found markers:", interactiveMarkers.length);

      if (interactiveMarkers.length > 0) {
        interactiveMarkers.forEach((markerElement: Element) => {
          const positionAttr = markerElement.getAttribute("position");
          if (!positionAttr) return;

          const [lat, lng] = positionAttr
            .split(",")
            .map((coord) => parseFloat(coord.trim()));
          const markerData = markers.find(
            (m) =>
              Math.abs(m.lat - lat) < 0.0001 && Math.abs(m.lng - lng) < 0.0001
          );

          if (markerData) {
            console.log("Adding click listener to marker:", markerData);
            markerElement.addEventListener("gmp-click", () => {
              console.log("Marker click event fired");
              handleMarkerClick(markerData);
            });
          }
        });
      }
    }

    if (markerVisible && coordinates) {
      console.log("Starting marker setup...");
      const timer = setTimeout(() => {
        setupMarkerListeners();
      }, 2000); // Increased timeout to ensure everything is loaded

      return () => clearTimeout(timer);
    }
  }, [markerVisible, markers, coordinates]);

  return (
    <div className="w-full h-screen">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setPolygon(!polygon)}
        >
          {polygon ? "Hide Polygon" : "Show Polygon"}
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => setMarkerVisible(!markerVisible)}
        >
          {markerVisible ? "Hide Markers" : "Show Markers"}
        </button>
      </div>

      <div className="relative w-full h-full">
        {coordinates && (
          <gmp-map-3d
            ref={(el) => {
              mapRef.current = el;
            }}
            mode="hybrid"
            center={`${coordinates.lat}, ${coordinates.lng}`}
            tilt={polygon ? "10" : "75"}
            range="1000"
            heading="330"
            zoom-controls="true"
            className="w-full h-full"
            onMouseDown={handleLongPressStart}
            onMouseUp={handleLongPressEnd}
            onMouseLeave={handleLongPressEnd}
            onTouchStart={handleLongPressStart}
            onTouchEnd={handleLongPressEnd}
          >
            {polygon && (
              <gmp-polygon-3d
                altitude-mode="relative-to-ground"
                fill-color="rgba(255, 0, 0, 0.5)"
                stroke-color="#0000ff"
                stroke-width="8"
              />
            )}

            {markerVisible &&
              markers.map((marker, index) => (
                <gmp-marker-3d-interactive
                  key={index}
                  position={`${marker.lat}, ${marker.lng}`}
                  altitude="1000"
                  altitude-mode="relative-to-ground"
                  title={marker.title}
                  style={{
                    cursor: "pointer",
                  }}
                />
              ))}

            {selectedMarker && (
              <gmp-info-window-3d
                position={`${selectedMarker.lat}, ${selectedMarker.lng}`}
                altitude="1100"
                altitude-mode="relative-to-ground"
                open="true"
                style={{
                  display: "block",
                  zIndex: 1000,
                }}
              >
                <div
                  className="bg-white p-4 rounded-lg shadow-xl max-w-xs"
                  style={{
                    position: "relative",
                    zIndex: 1000,
                  }}
                >
                  <h3 className="font-bold text-lg mb-2">
                    {selectedMarker.title}
                  </h3>
                  <p className="text-gray-600">Click anywhere to close</p>
                </div>
              </gmp-info-window-3d>
            )}
          </gmp-map-3d>
        )}
      </div>
      {selectedMarker && (
        <MarkerDialog
          marker={selectedMarker}
          onClose={() => setSelectedMarker(null)}
        />
      )}
    </div>
  );
}
