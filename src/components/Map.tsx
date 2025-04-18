import React, { useEffect, useRef, useState } from 'react';

interface MapProps {
    center: string;
}

export function Map({ center }: MapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        if (!window.google) return;

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: center }, (results, status) => {
            if (status === 'OK' && results?.[0]) {
                const location = results[0].geometry.location;
                const latLng = { lat: location.lat(), lng: location.lng() };
                setCoordinates(latLng);
            }
        });
    }, [center]);

    useEffect(() => {
        if (!coordinates || !mapRef.current || !window.google) return;

        const map = new google.maps.Map(mapRef.current, {
            center: coordinates,
            zoom: 18,
            heading: 330,
            tilt: 75,
            mapId: 'YOUR_MAP_ID', // Optional: if using custom 3D maps
            mapTypeId: google.maps.MapTypeId.HYBRID,
        });

        const marker = new google.maps.Marker({
            position: coordinates,
            map,
            title: 'Marker Location',
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `<div><strong>${center}</strong></div>`,
        });

        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });

    }, [coordinates]);

    return <div ref={mapRef} className="w-full h-screen" />;
}
