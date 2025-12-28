import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DOMHistogram({ data }) {
    if (!data || data.length === 0) {
        return <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No data</div>;
    }

    return (
        <div className="chart-container">
            <h3 style={{ textAlign: 'center' }}>DOM Histogram (10-day bins)</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3498db" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
