import React, { useState } from 'react';

export default function FilterPanel({ priceRanges, seasons, onPriceRangeChange, onSeasonChange, onRadiusFilter, radiusAddress, radiusValue, isLoadingGeocoding }) {
    const [address, setAddress] = useState(radiusAddress || '');
    const [radius, setRadius] = useState('');

    const priceRangeOptions = [
        { id: '500k', label: '$500K–$1M' },
        { id: '1m+', label: '$1M+' },
    ];

    const seasonOptions = [
        { id: 'jan_mar', label: 'Jan–Mar' },
        { id: 'april_june', label: 'Apr–Jun' },
        { id: 'july_sep', label: 'Jul–Sep' },
        { id: 'oct_dec', label: 'Oct–Dec' },
        { id: 'unsold', label: 'Unsold (90+ Days On The Market)' },
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
        if (address.trim() && radius) {
            onRadiusFilter(address, parseFloat(radius));
        }
    };

    const handleClearRadius = () => {
        setAddress('');
        setRadius('');
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
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="Radius"
                        value={radius}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                setRadius(val);
                            }
                        }}
                        style={{ flex: 1, padding: '6px', fontSize: '13px' }}
                    />
                    <span style={{ fontSize: '13px', minWidth: '40px' }}>miles</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={handleApplyRadius}
                        disabled={isLoadingGeocoding || !radius}
                        style={{
                            flex: 1,
                            padding: '6px',
                            backgroundColor: (isLoadingGeocoding || !radius) ? '#ccc' : '#27ae60',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: (isLoadingGeocoding || !radius) ? 'not-allowed' : 'pointer',
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
