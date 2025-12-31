export default function StatisticsPanel({ stats, soldCount, unsoldCount }) {
    return (
        <div className="stats-panel">
            <h3 style={{ textAlign: 'center' }}>DOM Summary Statistics</h3>
            <div style={{ 
                fontSize: '12px', 
                color: '#666', 
                textAlign: 'center', 
                marginBottom: '12px',
                fontStyle: 'italic' 
            }}>
                Based on sold properties only
            </div>
            <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                <tbody>
                    <tr>
                        <td><strong>Sold Properties:</strong></td>
                        <td>{soldCount || stats.count}</td>
                    </tr>
                    {unsoldCount > 0 && (
                        <tr>
                            <td><strong>Unsold Properties:</strong></td>
                            <td style={{ color: '#95a5a6' }}>{unsoldCount}</td>
                        </tr>
                    )}
                    <tr>
                        <td><strong>Min DOM:</strong></td>
                        <td>{stats.min}</td>
                    </tr>
                    <tr>
                        <td><strong>Max DOM:</strong></td>
                        <td>{stats.max}</td>
                    </tr>
                    <tr>
                        <td><strong>Mean DOM:</strong></td>
                        <td>{stats.mean}</td>
                    </tr>
                    <tr>
                        <td><strong>25th Percentile:</strong></td>
                        <td>{stats.p25}</td>
                    </tr>
                    <tr>
                        <td><strong>Median (50th):</strong></td>
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