import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function App() {
    const [data, setData] = useState(null);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        fetch("https://water-quality-backend-jwnh.onrender.com/predict")
            .then(response => response.json())
            .then(result => {
                setData(result);
                setChartData(prevData => [...prevData, {
                    time: new Date().toLocaleTimeString(),
                    temperature: result.temperature,
                    ph: result.ph,
                    tds: result.tds,
                    turbidity: result.turbidity
                }]);
            })
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <h1 className="text-3xl font-bold">🌊 Water Quality Dashboard</h1>
            {data ? (
                <div className="mt-4 bg-white p-6 shadow-lg rounded-lg w-full max-w-2xl">
                    <p><strong>Temperature:</strong> {data.temperature}°C</p>
                    <p><strong>pH Level:</strong> {data.ph}</p>
                    <p><strong>TDS:</strong> {data.tds} ppm</p>
                    <p><strong>Turbidity:</strong> {data.turbidity} NTU</p>
                    <p><strong>Dissolved Oxygen:</strong> {data["Dissolved Oxygen (DO)"]}</p>
                    <p><strong>Heavy Metals:</strong> {data["Heavy Metal Concentration"]}</p>
                    <p><strong>Bacteria Status:</strong> {data["Bacterial Contamination"]}</p>
                </div>
            ) : (
                <p>Loading data...</p>
            )}

            {/* Graph Section */}
            <div className="w-full max-w-2xl mt-8">
                <h2 className="text-xl font-semibold text-center">Water Quality Trends</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="temperature" stroke="#ff7300" name="Temperature" />
                        <Line type="monotone" dataKey="ph" stroke="#387908" name="pH Level" />
                        <Line type="monotone" dataKey="tds" stroke="#8884d8" name="TDS" />
                        <Line type="monotone" dataKey="turbidity" stroke="#82ca9d" name="Turbidity" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
