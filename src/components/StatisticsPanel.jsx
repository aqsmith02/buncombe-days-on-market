import React from 'react';

export default function StatisticsPanel({ stats }) {
    return (
        <div className="stats-panel">
            <h3>DOM Summary Statistics</h3>
            <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                <tbody>
                    <tr>
                        <td><strong>Total Properties:</strong></td>
                        <td>{stats.count}</td>
                    </tr>
                    <tr>
                        <td><strong>Min:</strong></td>
                        <td>{stats.min}</td>
                    </tr>
                    <tr>
                        <td><strong>Max:</strong></td>
                        <td>{stats.max}</td>
                    </tr>
                    <tr>
                        <td><strong>Mean:</strong></td>
                        <td>{stats.mean}</td>
                    </tr>
                    <tr>
                        <td><strong>25th Percentile:</strong></td>
                        <td>{stats.p25}</td>
                    </tr>
                    <tr>
                        <td><strong>50th Percentile:</strong></td>
                        <td>{stats.p50}</td>
                    </tr>
                    <tr>
                        <td><strong>75th Percentile:</strong></td>
                        <td>{stats.p75}</td>
                    </tr>
                    <tr>
                        <td><strong>90th Percentile:</strong></td>
                        <td>{stats.p90}</td>
                    </tr>
                    <tr>
                        <td><strong>Std Dev:</strong></td>
                        <td>{stats.stdDev}</td>
                    </tr>
                    <tr>
                        <td><strong>MAD:</strong></td>
                        <td>{stats.mad}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
