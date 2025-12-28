import React from 'react'

export default function DataList({ data }) {
    if (data === null) return <div>Loading dataset…</div>
    if (data && data.error) return <div className="error">Error: {data.error}</div>
    if (!Array.isArray(data)) return <pre>{JSON.stringify(data, null, 2)}</pre>

    const keys = Object.keys(data[0] || {})

    return (
        <div className="data-list">
            <table>
                <thead>
                    <tr>{keys.map((k) => <th key={k}>{k}</th>)}</tr>
                </thead>
                <tbody>
                    {data.map((row, idx) => (
                        <tr key={idx}>
                            {keys.map((k) => <td key={k}>{String(row[k] ?? '')}</td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
