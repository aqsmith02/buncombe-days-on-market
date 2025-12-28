import React, { useEffect, useState, useMemo } from 'react'
import FilterPanel from './components/FilterPanel'
import StatisticsPanel from './components/StatisticsPanel'
import DOMPieChart from './components/DOMPieChart'
import DOMHistogram from './components/DOMHistogram'
import MapComponent from './components/MapComponent'
import { calculateStats, getDOMDistributionWithQuartiles, percentile, getHistogramData } from './utils/stats'

export default function App() {
    const [priceRanges, setPriceRanges] = useState(['500k', '1m+'])
    const [seasons, setSeasons] = useState(['jan_mar', 'april_june', 'july_sep', 'oct_dec', 'unsold'])
    const [allData, setAllData] = useState([])
    const [allDataForQuartiles, setAllDataForQuartiles] = useState([])
    const [radiusValue, setRadiusValue] = useState(5)
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

    // Calculate derived data - use allDataForQuartiles for quartile calculation
    const allDoms = useMemo(() => allData.map((p) => p['days on market']).filter((d) => d !== undefined), [allData])
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
                                <h2>Property Map</h2>
                                <MapComponent properties={allData} allDoms={allDomsForQuartiles} />
                            </div>

                            {/* Data Table */}
                            <div style={{ marginTop: '30px', fontSize: '12px', overflowX: 'auto' }}>
                                <h2>Property Data</h2>
                                {allData.length > 0 ? (
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ backgroundColor: '#f5f5f5' }}>
                                                <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Address</th>
                                                <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Price</th>
                                                <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>DOM</th>
                                                <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Beds</th>
                                                <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Baths</th>
                                                <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>SQFT</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allData.slice(0, 50).map((prop, i) => (
                                                <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                                    <td style={{ padding: '8px' }}>{prop.address}</td>
                                                    <td style={{ padding: '8px' }}>${prop.price?.toLocaleString()}</td>
                                                    <td style={{ padding: '8px' }}>{prop['days on market']}</td>
                                                    <td style={{ padding: '8px' }}>{prop.beds}</td>
                                                    <td style={{ padding: '8px' }}>{prop.baths}</td>
                                                    <td style={{ padding: '8px' }}>{prop.sqft?.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div style={{ padding: '20px', color: '#999' }}>No data selected</div>
                                )}
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}
