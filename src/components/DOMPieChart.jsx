import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

export default function DOMPieChart({ data }) {
    if (!data || data.length === 0) {
        return <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No data</div>;
    }

    // Calculate total and add percentages to data
    const total = data.reduce((sum, entry) => sum + entry.value, 0);
    const dataWithPercent = data.map(entry => ({
        ...entry,
        percent: total > 0 ? ((entry.value / total) * 100).toFixed(1) : 0
    }));

    // Custom label to show percentage on pie slices
    const renderLabel = (entry) => {
        return `${entry.percent}%`;
    };

    // Custom tooltip to show name, count, and percentage
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div style={{
                    backgroundColor: 'white',
                    padding: '8px 12px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '13px'
                }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{data.name}</div>
                    <div>Count: {data.value}</div>
                    <div>Percent: {data.percent}%</div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="chart-container">
            <h3 style={{ textAlign: 'center' }}>DOM Quartile Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={dataWithPercent}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={renderLabel}
                        labelLine={false}
                    >
                        {dataWithPercent.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}