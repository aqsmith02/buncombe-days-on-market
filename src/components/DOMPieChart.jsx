import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

export default function DOMPieChart({ data }) {
    if (!data || data.length === 0) {
        return <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No data</div>;
    }

    return (
        <div className="chart-container">
            <h3 style={{ textAlign: 'center' }}>DOM Quartile Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
