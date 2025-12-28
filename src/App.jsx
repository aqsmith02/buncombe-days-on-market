import React, { useEffect, useState, useMemo } from 'react'
import FilterPanel from './components/FilterPanel'
import StatisticsPanel from './components/StatisticsPanel'
import DOMPieChart from './components/DOMPieChart'
import DOMHistogram from './components/DOMHistogram'
import MapComponent from './components/MapComponent'
import { calculateStats, getDOMDistributionWithQuartiles, percentile, getHistogramData } from './utils/stats'
import { geocodeAddress, filterByRadius } from './utils/geocoding'

export default function App() {
    const [priceRanges, setPriceRanges] = useState(['500k', '1m+'])
    const [seasons, setSeasons] = useState(['jan_mar', 'april_june', 'july_sep', 'oct_dec', 'unsold'])
    const [allData, setAllData] = useState([])
    const [allDataForQuartiles, setAllDataForQuartiles] = useState([])
    const [radiusAddress, setRadiusAddress] = useState(null)
    const [radiusCenter, setRadiusCenter] = useState(null)
    const [radiusValue, setRadiusValue] = useState(5)
    const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false)
    const [loading, setLoading] = useState(false)

    // Build dataset lists
    const priceMap = {
        '500k': '500k_to_1m',
        '1m+': '1m_plus',
    }
    const seasonMap = {
        'jan_mar': 'jan_mar',
        'april_june': 'april_june',
        'july_sep': 'july_sep',
        'oct_dec': 'oct_dec',
        'unsold': 'unsold',
    }
    const allSeasons = ['jan_mar', 'april_june', 'july_sep', 'oct_dec', 'unsold']

    // Datasets for display (filtered by price range and season)
    const selectedDatasets = useMemo(() => {
        const datasets = []
        priceRanges.forEach((price) => {
            seasons.forEach((season) => {
                const filename = `${priceMap[price]}_${seasonMap[season]}.json`
                datasets.push(filename)
            })
        })
        return datasets
    }, [priceRanges, seasons])

    // Datasets for quartile calculation (all seasons for selected price ranges)
    const datasetsForQuartiles = useMemo(() => {
        const datasets = []
        priceRanges.forEach((price) => {
            allSeasons.forEach((season) => {
                const filename = `${priceMap[price]}_${seasonMap[season]}.json`
                datasets.push(filename)
            })
        })
        return datasets
    }, [priceRanges])

    // Load displayed datasets
    useEffect(() => {
        if (selectedDatasets.length === 0) {
            setAllData([])
            return
        }

        setLoading(true)
        Promise.all(
            selectedDatasets.map((ds) =>
                fetch(`/data/${ds}`)
                    .then((r) => r.json())
                    .catch(() => [])
            )
        )
            .then((results) => {
                const combined = results.flat()
                setAllData(combined)
            })
            .finally(() => setLoading(false))
    }, [selectedDatasets])

    // Load datasets for quartile calculation
    useEffect(() => {
        Promise.all(
            datasetsForQuartiles.map((ds) =>
                fetch(`/data/${ds}`)
                    .then((r) => r.json())
                    .catch(() => [])
            )
        )
            .then((results) => {
                const combined = results.flat()
                setAllDataForQuartiles(combined)
            })
    }, [datasetsForQuartiles])

    // Handle radius filter
    const handleRadiusFilter = async (address, radius) => {
        if (!address) {
            setRadiusAddress(null)
            setRadiusCenter(null)
            setRadiusValue(5)
            return
        }

        setIsLoadingGeocoding(true)
        try {
            const geocoded = await geocodeAddress(address)
            setRadiusAddress(address)
            setRadiusCenter({ lat: geocoded.lat, lon: geocoded.lon })
            setRadiusValue(radius)
        } catch (error) {
            alert('Could not find address. Please try another.')
            console.error(error)
        } finally {
            setIsLoadingGeocoding(false)
        }
    }

    // Apply radius filter to data
    const filteredData = useMemo(() => {
        if (!radiusCenter) return allData
        return filterByRadius(allData, radiusCenter.lat, radiusCenter.lon, radiusValue)
    }, [allData, radiusCenter, radiusValue])

    // Calculate derived data - use allDataForQuartiles for quartile calculation
    const allDoms = useMemo(() => filteredData.map((p) => p['days on market']).filter((d) => d !== undefined), [filteredData])
    const allDomsForQuartiles = useMemo(() => allDataForQuartiles.map((p) => p['days on market']).filter((d) => d !== undefined), [allDataForQuartiles])
    const stats = useMemo(() => calculateStats(allDoms), [allDoms])
    const pieData = useMemo(() => {
        if (allDomsForQuartiles.length === 0) {
            return [
                { name: 'Q1 (0-25%)', value: 0, color: '#2ecc71' },
                { name: 'Q2 (25-50%)', value: 0, color: '#f1c40f' },
                { name: 'Q3 (50-75%)', value: 0, color: '#e67e22' },
                { name: 'Q4 (75-100%)', value: 0, color: '#e74c3c' },
            ]
        }
        const q1 = percentile(allDomsForQuartiles, 25)
        const q2 = percentile(allDomsForQuartiles, 50)
        const q3 = percentile(allDomsForQuartiles, 75)
        return getDOMDistributionWithQuartiles(allDoms, q1, q2, q3)
    }, [allDoms, allDomsForQuartiles])
    const histData = useMemo(() => getHistogramData(allDoms), [allDoms])

    return (
        <div className="app">
            <header className="app-header">
                <h1>Buncombe County Housing — Days on Market</h1>
            </header>

            <main className="app-main">
                <aside className="sidebar">
                    <FilterPanel
                        priceRanges={priceRanges}
                        seasons={seasons}
                        onPriceRangeChange={setPriceRanges}
                        onSeasonChange={setSeasons}
                        onRadiusFilter={handleRadiusFilter}
                        radiusAddress={radiusAddress}
                        radiusValue={radiusValue}
                        isLoadingGeocoding={isLoadingGeocoding}
                    />
                </aside>

                <section className="content">
                    {loading && <div style={{ padding: '20px', color: '#666' }}>Loading datasets…</div>}

                    {!loading && (
                        <div>
                            {/* Charts Row */}
                            <div className="charts-row">
                                <DOMPieChart data={pieData} />
                                <DOMHistogram data={histData} />
                                <StatisticsPanel stats={stats} />
                            </div>

                            {/* Map */}
                            <div style={{ marginTop: '30px', marginBottom: '30px' }}>
                                <h2 style={{ textAlign: 'center' }}>Property Map</h2>
                                <MapComponent properties={filteredData} allDoms={allDomsForQuartiles} radiusCenter={radiusCenter} radiusValue={radiusValue} />
                            </div>

                            {/* Download Button */}
                            <div style={{ marginTop: '30px', textAlign: 'center' }}>
                                <button
                                    onClick={() => {
                                        const dataStr = JSON.stringify(filteredData, null, 2);
                                        const dataBlob = new Blob([dataStr], { type: 'application/json' });
                                        const url = URL.createObjectURL(dataBlob);
                                        const link = document.createElement('a');
                                        link.href = url;
                                        link.download = `buncombe-data-${new Date().toISOString().split('T')[0]}.json`;
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                        URL.revokeObjectURL(url);
                                    }}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#3498db',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                    }}
                                >
                                    Download Filtered Data
                                </button>
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}
