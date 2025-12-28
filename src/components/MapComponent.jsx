import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getQuartileColor } from '../utils/stats';

export default function MapComponent({ properties, allDoms, radiusCenter, radiusValue }) {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markersRef = useRef([]);
    const radiusCircleRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current) return;

        // Initialize map
        if (!mapInstance.current) {
            mapInstance.current = L.map(mapRef.current).setView([35.5951, -82.5515], 11);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap',
            }).addTo(mapInstance.current);
        }

        // Clear old markers
        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];

        // Clear old radius circle
        if (radiusCircleRef.current) {
            radiusCircleRef.current.remove();
            radiusCircleRef.current = null;
        }

        // Draw radius circle if active
        if (radiusCenter && radiusValue) {
            radiusCircleRef.current = L.circle([radiusCenter.lat, radiusCenter.lon], {
                radius: radiusValue * 1609.34, // Convert miles to meters
                color: '#3498db',
                fillColor: '#3498db',
                fillOpacity: 0.1,
                weight: 2,
                opacity: 0.6,
                dashArray: '5, 5',
            }).addTo(mapInstance.current);
        }

        // Add new markers
        if (properties && properties.length > 0) {
            properties.forEach((prop) => {
                const lat = prop.lat;
                const lon = prop.lon;
                const dom = prop['days on market'];

                if (lat && lon && dom !== undefined) {
                    const color = getQuartileColor(dom, allDoms);

                    // Create 3 circles with different sizes and opacities
                    // Largest circle - very opaque
                    L.circleMarker([lat, lon], {
                        radius: 14,
                        fillColor: color,
                        color: color,
                        weight: 0,
                        opacity: 0,
                        fillOpacity: 0.12,
                    }).addTo(mapInstance.current);

                    // Medium circle - somewhat opaque
                    L.circleMarker([lat, lon], {
                        radius: 9,
                        fillColor: color,
                        color: color,
                        weight: 0,
                        opacity: 0,
                        fillOpacity: 0.22,
                    }).addTo(mapInstance.current);

                    // Small circle - not opaque
                    const marker = L.circleMarker([lat, lon], {
                        radius: 3,
                        fillColor: color,
                        color: color,
                        weight: 1,
                        opacity: 0.65,
                        fillOpacity: 0.7,
                    })
                        .bindPopup(
                            `<div style="font-size: 12px;">
                <strong>${prop.address}</strong><br/>
                Price: $${prop.price?.toLocaleString()}<br/>
                DOM: ${dom} days<br/>
                <a href="${prop.url}" target="_blank">View Listing</a>
              </div>`
                        )
                        .addTo(mapInstance.current);

                    markersRef.current.push(marker);
                }
            });
        }
    }, [properties, allDoms, radiusCenter, radiusValue]);

    return (
        <div style={{ width: '100%', height: '600px', borderRadius: '8px', overflow: 'hidden' }}>
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        </div>
    );
}
