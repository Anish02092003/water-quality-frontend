import { useEffect, useState } from "react";
import * as Recharts from "recharts";

export default function App() {
    const [data, setData] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [formData, setFormData] = useState({
        temperature: "",
        ph: "",
        tds: "",
        turbidity: ""
    });

    // Function to fetch predictions
    const fetchPredictions = () => {
        fetch("https://water-quality-backend-jwnh.onrender.com/predict")
            .then(response => response.json())
            .then(result => {
                setData(result);
                setChartData(prevData => [...prevData.slice(-20), {
                    time: new Date().toLocaleTimeString(),
                    temperature: result.temperature,
                    ph: result.ph,
                    tds: result.tds,
                    turbidity: result.turbidity
                }]);
            })
            .catch(error => console.error("Error fetching data:", error));
    };

    // Fetch predictions every 5 seconds
    useEffect(() => {
        fetchPredictions();
        const interval = setInterval(fetchPredictions, 5000);
        return () => clearInterval(interval);
    }, []);

    // Function to handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Function to submit new sensor data
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("https://water-quality-backend-jwnh.onrender.com/submit_data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                temperature: parseFloat(formData.temperature),
                ph: parseFloat(formData.ph),
                tds: parseFloat(formData.tds),
                turbidity: parseFloat(formData.turbidity)
            })
        })
        .then(response => response.json())
        .then(() => {
            fetchPredictions();
            setFormData({ temperature: "", ph: "", tds: "", turbidity: "" });
        })
        .catch(error => console.error("Error submitting data:", error));
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <h1 className="text-3xl font-bold">🌊 Water Quality Dashboard</h1>

            {/* Form for Sensor Data Input */}
            <form onSubmit={handleSubmit} className="mt-4 bg-white p-6 shadow-lg rounded-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Enter Sensor Data</h2>
                <input type="number" name="temperature" placeholder="Temperature (°C)" value={formData.temperature} onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
                <input type="number" name="ph" placeholder="pH Level" value={formData.ph} onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
                <input type="number" name="tds" placeholder="TDS (ppm)" value={formData.tds} onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
                <input type="number" name="turbidity" placeholder="Turbidity (NTU)" value={formData.turbidity} onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Submit Data</button>
            </form>

            {/* Prediction Data Display */}
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
                <Recharts.ResponsiveContainer width="100%" height={300}>
                    <Recharts.LineChart data={chartData}>
                        <Recharts.CartesianGrid strokeDasharray="3 3" />
                        <Recharts.XAxis dataKey="time" />
                        <Recharts.YAxis />
                        <Recharts.Tooltip />
                        <Recharts.Line type="monotone" dataKey="temperature" stroke="#ff7300" name="Temperature" />
                        <Recharts.Line type="monotone" dataKey="ph" stroke="#387908" name="pH Level" />
                        <Recharts.Line type="monotone" dataKey="tds" stroke="#8884d8" name="TDS" />
                        <Recharts.Line type="monotone" dataKey="turbidity" stroke="#82ca9d" name="Turbidity" />
                    </Recharts.LineChart>
                </Recharts.ResponsiveContainer>
            </div>
        </div>
    );
}
