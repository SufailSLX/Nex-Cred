import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CheckCircle, Clock, Moon, Sun } from "lucide-react";

const API_URL = "http://localhost:5000/api/credits";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [credits, setCredits] = useState([]);

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetch(API_URL)
        .then(res => res.json())
        .then(data => setCredits(data))
        .catch(err => console.error("Error fetching data:", err));
    }
  }, [isAuthenticated]);

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin === "1234") setIsAuthenticated(true); // Replace with your desired PIN logic
    else alert("Invalid PIN");
  };

  const toggleStatus = async (id, currentStatus) => {
    // Optimistic UI update
    setCredits(credits.map(c => c._id === id ? { ...c, isPaid: !c.isPaid } : c));
    
    // Backend update
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPaid: !currentStatus })
    });
  };

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <motion.form 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          onSubmit={handlePinSubmit} 
          className="p-8 rounded-2xl shadow-xl border border-gray-700 bg-gray-800"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Enter PIN</h2>
          <input 
            type="password" maxLength="4" value={pin} 
            onChange={(e) => setPin(e.target.value)}
            className="w-full text-center text-4xl tracking-widest p-4 rounded-lg bg-gray-900 border border-gray-600 focus:outline-none focus:border-blue-500"
            autoFocus
          />
        </motion.form>
      </div>
    );
  }

  const chartData = credits.map(c => ({ name: c.personName, Amount: c.amount }));

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-3xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Credit Manager</h1>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-gray-700">
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </header>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className={`h-64 mb-8 p-4 rounded-2xl shadow-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
        >
          <h3 className="mb-4 font-semibold opacity-70">Lending Trends</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="name" stroke={darkMode ? "#9ca3af" : "#4b5563"} />
              <YAxis stroke={darkMode ? "#9ca3af" : "#4b5563"} />
              <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1f2937' : '#fff' }} />
              <Line type="monotone" dataKey="Amount" stroke="#3b82f6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="space-y-4">
          {credits.map((credit, i) => (
            <motion.div 
              key={credit._id}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className={`p-4 rounded-xl flex items-center justify-between shadow-md border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
            >
              <div>
                <h4 className="text-lg font-bold">{credit.personName}</h4>
                <div className="flex items-center text-sm opacity-60 mt-1">
                  <Clock size={14} className="mr-1" /> 
                  {new Date(credit.updatedAt).toLocaleString()}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-xl font-bold">${credit.amount}</span>
                <button 
                  onClick={() => toggleStatus(credit._id, credit.isPaid)}
                  className={`p-2 rounded-full transition-colors ${credit.isPaid ? 'text-green-500 bg-green-500/10' : 'text-gray-400 hover:text-blue-500'}`}
                >
                  <CheckCircle size={28} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}