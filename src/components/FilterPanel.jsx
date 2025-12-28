import React, { useState } from 'react';

export default function FilterPanel({ priceRanges, seasons, onPriceRangeChange, onSeasonChange, onRadiusFilter, radiusAddress, radiusValue, isLoadingGeocoding }) {
    const [address, setAddress] = useState(radiusAddress || '');
    const [radius, setRadius] = useState(radiusValue || 5);

    const priceRangeOptions = [
        { id: '500k', label: '$500K–$1M' },
        { id: '1m+', label: '$1M+' },
    ];

    const seasonOptions = [
        { id: 'jan_mar', label: 'Jan–Mar' },
        { id: 'april_june', label: 'Apr–Jun' },
        { id: 'july_sep', label: 'Jul–Sep' },
        { id: 'oct_dec', label: 'Oct–Dec' },
        { id: 'unsold', label: 'Unsold' },
    ];

    const handlePriceRangeChange = (id) => {
        const updated = priceRanges.includes(id)
            ? priceRanges.filter((p) => p !== id)
            : [...priceRanges, id];
        onPriceRangeChange(updated);
    };

    const handleSeasonChange = (id) => {
        const updated = seasons.includes(id)
            ? seasons.filter((s) => s !== id)
            : [...seasons, id];
        onSeasonChange(updated);
    };

    const handleApplyRadius = () => {
        if (address.trim()) {
            onRadiusFilter(address, radius);
        }
    };

    const handleClearRadius = () => {
        setAddress('');
        setRadius(5);
        onRadiusFilter(null, null);
    };

    return (
        <div className="filter-panel">
            <h3>Filters</h3>

            <div className="filter-group">
                <h4>Price Range</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {priceRangeOptions.map((option) => (
                        <label key={option.id} style={{ display: 'flex', alignItems: 'center', fontSize: '13px' }}>
                            <input
                                type="checkbox"
                                checked={priceRanges.includes(option.id)}
                                onChange={() => handlePriceRangeChange(option.id)}
                                style={{ marginRight: '6px' }}
                            />
                            {option.label}
                        </label>
                    ))}
                </div>
            </div>

            <div className="filter-group">
                <h4>Season</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {seasonOptions.map((option) => (
                        <label key={option.id} style={{ display: 'flex', alignItems: 'center', fontSize: '13px' }}>
                            <input
                                type="checkbox"
                                checked={seasons.includes(option.id)}
                                onChange={() => handleSeasonChange(option.id)}
                                style={{ marginRight: '6px' }}
                            />
                            {option.label}
                        </label>
                    ))}
                </div>
            </div>

            <div className="filter-group">
                <h4>Radius Filter</h4>
                <input
                    type="text"
                    placeholder="Enter address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{ width: '100%', padding: '6px', marginBottom: '8px', fontSize: '13px', boxSizing: 'border-box' }}
                />
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input
                        type="number"
                        placeholder="Radius (miles)"
                        value={radius}
                        onChange={(e) => setRadius(parseFloat(e.target.value) || 5)}
                        step="0.1"
                        min="0.1"
                        style={{ flex: 1, padding: '6px', fontSize: '13px' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={handleApplyRadius}
                        disabled={isLoadingGeocoding}
                        style={{
                            flex: 1,
                            padding: '6px',
                            backgroundColor: isLoadingGeocoding ? '#ccc' : '#27ae60',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: isLoadingGeocoding ? 'not-allowed' : 'pointer',
                            fontSize: '13px',
                        }}
                    >
                        {isLoadingGeocoding ? 'Loading...' : 'Apply'}
                    </button>
                    <button
                        onClick={handleClearRadius}
                        style={{
                            flex: 1,
                            padding: '6px',
                            backgroundColor: '#e74c3c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '13px',
                        }}
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
}
