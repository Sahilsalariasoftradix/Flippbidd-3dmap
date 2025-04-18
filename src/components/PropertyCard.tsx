import React, { useEffect, useState } from 'react';

interface PropertyCardProps {
  title: string;
  address: string;
}

export function PropertyCard({ title, address }: PropertyCardProps) {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (window.google) {
      const geocoder = new google.maps.Geocoder();

      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;
          setCoordinates({
            lat: location.lat(),
            lng: location.lng()
          });
        }
      });
    }
  }, [address]);

  return (
    <div className="w-full">
      {coordinates && (
        <gmp-map-3d
          mode="satellite"
          center={`${coordinates.lat}, ${coordinates.lng}`}
          tilt="75"
          range="2000"
          heading="330"
          className="w-full h-[600px]"
        />
      )}
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-lg text-gray-600">{address}</p>
      </div>
    </div>
  );
}
