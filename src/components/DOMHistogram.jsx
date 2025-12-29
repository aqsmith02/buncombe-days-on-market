import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DOMHistogram({ data }) {
    if (!data || data.length === 0) {
        return <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No data</div>;
    }

    // Fill in missing bins with 0 counts to show gaps
    const fillGaps = (data) => {
        if (data.length === 0) return data;

        const binSize = 10;
        const minDom = Math.min(...data.map(d => d.dom));
        const maxDom = Math.max(...data.map(d => d.dom));

        // Create a map of existing data
        const dataMap = {};
        data.forEach(item => {
            dataMap[item.dom] = item;
        });

        // Fill in all bins from min to max
        const filledData = [];
        for (let dom = minDom; dom <= maxDom; dom += binSize) {
            if (dataMap[dom]) {
                filledData.push(dataMap[dom]);
            } else {
                filledData.push({
                    range: `${dom}-${dom + binSize}`,
                    count: 0,
                    dom: dom
                });
            }
        }

        return filledData;
    };

    const filledData = fillGaps(data);

    // Calculate which indices to show (4 equally spaced labels)
    const totalBins = filledData.length;
    const labelIndices = [
        0,
        Math.floor(totalBins / 3),
        Math.floor((2 * totalBins) / 3),
        totalBins - 1
    ];

    // Custom tooltip to handle 0 counts gracefully
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
                    <div style={{ fontWeight: 'bold' }}>{data.range} days</div>
                    <div>Properties: {data.count}</div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="chart-container">
            <h3 style={{ textAlign: 'center' }}>DOM Histogram (10-day bins)</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filledData} margin={{ bottom: 20, right: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="range"
                        interval={0}
                        tick={(props) => {
                            const { x, y, payload, index } = props;
                            
                            if (!labelIndices.includes(index)) {
                                return null;
                            }

                            return (
                                <g transform={`translate(${x},${y})`}>
                                    <text 
                                        x={0} 
                                        y={0} 
                                        dy={16} 
                                        textAnchor="middle" 
                                        fill="#666"
                                        fontSize={12}
                                    >
                                        {payload.value}
                                    </text>
                                </g>
                            );
                        }}
                    />
                    <YAxis label={{ value: 'Properties', angle: -90, position: 'insideLeft' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill="#3498db" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}