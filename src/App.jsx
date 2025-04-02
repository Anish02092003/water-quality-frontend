
import { useEffect, useState } from "react";

export default function App() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch("https://water-quality-backend-jwnh.onrender.com/predict")
            .then(response => response.json())
            .then(result => setData(result))
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <h1 className="text-3xl font-bold">🌊 Water Quality Dashboard</h1>
            {data ? (
                <div className="mt-4 bg-white p-6 shadow-lg rounded-lg">
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
        </div>
    );
}
