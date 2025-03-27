import React, { useState } from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const WaterQualityForm = () => {
  const [formData, setFormData] = useState({
    temperature: "",
    ph: "",
    tds: "",
    turbidity: ""
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    const data = await response.json();
    setResult(data);
  };

  return (
    <div>
      <h2>🌊 Water Quality Prediction</h2>
      <form onSubmit={handleSubmit}>
        <input type="number" name="temperature" placeholder="Temperature" onChange={handleChange} required />
        <input type="number" name="ph" placeholder="pH" onChange={handleChange} required />
        <input type="number" name="tds" placeholder="TDS" onChange={handleChange} required />
        <input type="number" name="turbidity" placeholder="Turbidity" onChange={handleChange} required />
        <button type="submit">Predict</button>
      </form>
      {result && (
        <div>
          <h3>Results:</h3>
          <p>DO: {result["Dissolved Oxygen (DO)"]}</p>
          <p>Heavy Metals: {result["Heavy Metal Concentration"]}</p>
          <p>Bacteria: {result["Bacterial Contamination"]}</p>
        </div>
      )}
    </div>
  );
};

export default WaterQualityForm;
