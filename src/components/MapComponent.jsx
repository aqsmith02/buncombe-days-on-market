import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getQuartileColor } from '../utils/stats';

export default function MapComponent({ properties, allDoms, radiusCenter, radiusValue }) {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markersRef = useRef([]);
    const radiusCircleRef = useRef(null);

    // Effect 1: Initialize map once on mount and clean up on unmount
    useEffect(() => {
        if (!mapRef.current || mapInstance.current) return;

        // Initialize map
        mapInstance.current = L.map(mapRef.current).setView([35.5951, -82.5515], 11);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap',
        }).addTo(mapInstance.current);

        // Cleanup function - runs when component unmounts
        return () => {
            if (mapInstance.current) {
                // Remove all markers
                markersRef.current.forEach((marker) => {
                    try {
                        marker.remove();
                    } catch (e) {
                        console.warn('Error removing marker:', e);
                    }
                });
                markersRef.current = [];
                
                // Remove radius circle
                if (radiusCircleRef.current) {
                    try {
                        radiusCircleRef.current.remove();
                    } catch (e) {
                        console.warn('Error removing circle:', e);
                    }
                    radiusCircleRef.current = null;
                }
                
                // Destroy the map instance
                try {
                    mapInstance.current.remove();
                } catch (e) {
                    console.warn('Error removing map:', e);
                }
                mapInstance.current = null;
            }
        };
    }, []); // Empty dependency array - only run once on mount/unmount

    // Effect 2: Update markers and radius circle when data changes
    useEffect(() => {
        if (!mapInstance.current) return;

        // Clear old markers
        markersRef.current.forEach((marker) => {
            try {
                marker.remove();
            } catch (e) {
                console.warn('Error removing marker:', e);
            }
        });
        markersRef.current = [];

        // Clear old radius circle
        if (radiusCircleRef.current) {
            try {
                radiusCircleRef.current.remove();
            } catch (e) {
                console.warn('Error removing circle:', e);
            }
            radiusCircleRef.current = null;
        }

        // Draw radius circle if active
        if (radiusCenter && radiusValue) {
            try {
                radiusCircleRef.current = L.circle([radiusCenter.lat, radiusCenter.lon], {
                    radius: radiusValue * 1609.34, // Convert miles to meters
                    color: '#2874a6',
                    fillColor: '#2874a6',
                    fillOpacity: 0.15,
                    weight: 4,
                    opacity: 1,
                    dashArray: '5, 5',
                }).addTo(mapInstance.current);
            } catch (e) {
                console.error('Error adding radius circle:', e);
            }
        }

        // Add new markers
        if (properties && properties.length > 0) {
            properties.forEach((prop) => {
                const lat = prop.lat;
                const lon = prop.lon;
                const dom = prop['days on market'];

                if (lat && lon && dom !== undefined) {
                    try {
                        const color = getQuartileColor(dom, allDoms);

                        // Create 3 circles with different sizes and opacities for glow effect
                        // Largest circle - very transparent (outer glow)
                        const outerCircle = L.circleMarker([lat, lon], {
                            radius: 14,
                            fillColor: color,
                            color: color,
                            weight: 0,
                            opacity: 0,
                            fillOpacity: 0.12,
                        }).addTo(mapInstance.current);
                        markersRef.current.push(outerCircle);

                        // Medium circle - somewhat transparent (middle glow)
                        const middleCircle = L.circleMarker([lat, lon], {
                            radius: 9,
                            fillColor: color,
                            color: color,
                            weight: 0,
                            opacity: 0,
                            fillOpacity: 0.22,
                        }).addTo(mapInstance.current);
                        markersRef.current.push(middleCircle);

                        // Small circle - main marker (inner core)
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
                    <a href="${prop.url}" target="_blank" rel="noopener noreferrer">View Listing</a>
                  </div>`
                            )
                            .addTo(mapInstance.current);

                        markersRef.current.push(marker);
                    } catch (e) {
                        console.warn('Error adding marker for property:', prop.address, e);
                    }
                }
            });
        }
    }, [properties, allDoms, radiusCenter, radiusValue]);

    return (
        <div style={{ width: '100%', height: '600px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        </div>
    );
}