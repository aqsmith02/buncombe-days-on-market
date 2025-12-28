import React, { useEffect, useState, useMemo } from 'react'
import FilterPanel from './components/FilterPanel'
import StatisticsPanel from './components/StatisticsPanel'
import DOMPieChart from './components/DOMPieChart'
import DOMHistogram from './components/DOMHistogram'
import MapComponent from './components/MapComponent'
import { calculateStats, getDOMDistribution, getHistogramData } from './utils/stats'

export default function App() {
    const [selectedDatasets, setSelectedDatasets] = useState([
        '500k_to_1m_jan_mar.json',
        '500k_to_1m_april_june.json',
        '500k_to_1m_july_sep.json',
        '500k_to_1m_oct_dec.json',
        '1m_plus_jan_mar.json',
        '1m_plus_april_june.json',
        '1m_plus_july_sep.json',
        '1m_plus_oct_dec.json',
    ])
    const [allData, setAllData] = useState([])
    const [radiusValue, setRadiusValue] = useState(5)
    const [loading, setLoading] = useState(false)

    // Load selected datasets
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

    // Calculate derived data
    const allDoms = useMemo(() => allData.map((p) => p['days on market']).filter((d) => d !== undefined), [allData])
    const stats = useMemo(() => calculateStats(allDoms), [allDoms])
    const pieData = useMemo(() => getDOMDistribution(allDoms), [allDoms])
    const histData = useMemo(() => getHistogramData(allDoms), [allDoms])

    return (
        <div className="app">
            <header className="app-header">
                <h1>Buncombe County Housing — Days on Market</h1>
            </header>

            <main className="app-main">
                <aside className="sidebar">
                    <FilterPanel
                        selected={selectedDatasets}
                        onToggle={setSelectedDatasets}
                        onRadiusChange={setRadiusValue}
                        radiusValue={radiusValue}
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
                                <MapComponent properties={allData} allDoms={allDoms} />
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
