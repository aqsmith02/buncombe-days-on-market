// Calculate distance between two points in miles using Haversine formula
export function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3959; // Earth's radius in miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Geocode an address using Nominatim (OpenStreetMap)
export async function geocodeAddress(address) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
        );
        const results = await response.json();

        if (results.length === 0) {
            throw new Error('Address not found');
        }

        return {
            lat: parseFloat(results[0].lat),
            lon: parseFloat(results[0].lon),
            address: results[0].display_name,
        };
    } catch (error) {
        console.error('Geocoding error:', error);
        throw error;
    }
}

// Filter properties by radius
export function filterByRadius(properties, centerLat, centerLon, radiusMiles) {
    return properties.filter((prop) => {
        if (!prop.lat || !prop.lon) return false;
        const distance = calculateDistance(centerLat, centerLon, prop.lat, prop.lon);
        return distance <= radiusMiles;
    });
}
