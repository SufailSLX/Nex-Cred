import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { CheckCircle, Clock, Moon, Sun, Plus, LogOut } from "lucide-react";

const API_URL = "http://localhost:5000/api/credits";

export default function App() {
  // Application State
  const [authStep, setAuthStep] = useState(0); // 0: Login, 1: PIN, 2: Dashboard
  const [darkMode, setDarkMode] = useState(true);
  const [credits, setCredits] = useState([]);
  
  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  
  // New Entry States
  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState("");

  // Check LocalStorage for existing user
  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  // Fetch Data when authenticated
  useEffect(() => {
    if (authStep === 2) {
      fetchCredits();
    }
  }, [authStep]);

  const fetchCredits = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setCredits(data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  // Step 1: Email/Password Login or Signup
  const handleLogin = (e) => {
    e.preventDefault();
    const savedEmail = localStorage.getItem("userEmail");
    const savedPass = localStorage.getItem("userPass");

    if (!savedEmail) {
      // First time "Signup"
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userPass", password);
      setAuthStep(1); // Move to PIN creation/entry
    } else if (email === savedEmail && password === savedPass) {
      setAuthStep(1); // Move to PIN entry
    } else {
      alert("Invalid Email or Password");
    }
  };

  // Step 2: PIN Verification
  const handlePinSubmit = (e) => {
    e.preventDefault();
    const savedPin = localStorage.getItem("userPin");

    if (!savedPin) {
      // First time PIN setup
      localStorage.setItem("userPin", pin);
      setAuthStep(2);
    } else if (pin === savedPin) {
      setAuthStep(2);
    } else {
      alert("Invalid PIN");
      setPin("");
    }
  };

  const handleLogout = () => {
    setAuthStep(0);
    setPassword("");
    setPin("");
  };

  // Add new Credit Entry
  const handleAddCredit = async (e) => {
    e.preventDefault();
    if (!newName || !newAmount) return;

    const newEntry = { personName: newName, amount: Number(newAmount) };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry)
      });
      const addedEntry = await res.json();
      setCredits([addedEntry, ...credits]);
      setNewName("");
      setNewAmount("");
    } catch (err) {
      console.error("Error adding credit:", err);
    }
  };

  // Toggle Paid Status
  const toggleStatus = async (id, currentStatus) => {
    // Optimistic UI update
    setCredits(credits.map(c => c._id === id ? { ...c, isPaid: !c.isPaid, updatedAt: new Date().toISOString() } : c));
    
    // Backend update
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPaid: !currentStatus })
    });
  };

  // Graph Data Preparation (Only showing unpaid debts for the trend)
  const chartData = credits
    .filter(c => !c.isPaid)
    .map(c => ({ name: c.personName, Amount: c.amount }))
    .reverse();

  // STYLES
  const themeBg = darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900";
  const cardBg = darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const inputBg = darkMode ? "bg-gray-900 border-gray-600 focus:border-blue-500" : "bg-white border-gray-300 focus:border-blue-500";

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${themeBg}`}>
      <AnimatePresence mode="wait">
        
        {/* STEP 1: LOGIN / SIGNUP */}
        {authStep === 0 && (
          <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} className="flex items-center justify-center min-h-[80vh]">
            <form onSubmit={handleLogin} className={`p-8 rounded-2xl shadow-xl border w-full max-w-md ${cardBg}`}>
              <h2 className="text-2xl font-bold mb-2 text-center">Welcome Back</h2>
              <p className="text-sm text-center mb-6 opacity-60">Sign in or create an account</p>
              <div className="space-y-4">
                <input 
                  type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className={`w-full p-3 rounded-lg border outline-none ${inputBg}`}
                />
                <input 
                  type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  className={`w-full p-3 rounded-lg border outline-none ${inputBg}`}
                />
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition">
                  Continue
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* STEP 2: PIN ENTRY */}
        {authStep === 1 && (
          <motion.div key="pin" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="flex items-center justify-center min-h-[80vh]">
            <form onSubmit={handlePinSubmit} className={`p-8 rounded-2xl shadow-xl border w-full max-w-sm ${cardBg}`}>
              <h2 className="text-2xl font-bold mb-6 text-center">Enter 4-Digit PIN</h2>
              <input 
                type="password" maxLength="4" pattern="\d{4}" required value={pin} onChange={(e) => setPin(e.target.value)}
                className={`w-full text-center text-4xl tracking-widest p-4 rounded-lg border outline-none ${inputBg}`}
                autoFocus
              />
              <button type="submit" className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition">
                Unlock Dashboard
              </button>
            </form>
          </motion.div>
        )}

        {/* STEP 3: DASHBOARD */}
        {authStep === 2 && (
          <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            
            {/* Header */}
            <header className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold">Credit Manager</h1>
                <p className="text-sm opacity-60">Logged in as {email}</p>
              </div>
              <div className="flex space-x-3">
                <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-full border ${cardBg}`}>
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button onClick={handleLogout} className={`p-2 rounded-full border text-red-500 ${cardBg}`}>
                  <LogOut size={20} />
                </button>
              </div>
            </header>

            {/* Add New Entry Form */}
            <form onSubmit={handleAddCredit} className={`mb-8 p-4 rounded-2xl shadow-md border flex gap-4 ${cardBg}`}>
              <input 
                type="text" placeholder="Person's Name" required value={newName} onChange={(e) => setNewName(e.target.value)}
                className={`flex-1 p-3 rounded-lg border outline-none ${inputBg}`}
              />
              <input 
                type="number" placeholder="Amount ($)" required value={newAmount} onChange={(e) => setNewAmount(e.target.value)}
                className={`w-32 p-3 rounded-lg border outline-none ${inputBg}`}
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition flex items-center justify-center">
                <Plus size={24} />
              </button>
            </form>

            {/* Graph */}
            <div className={`h-64 mb-8 p-4 rounded-2xl shadow-lg border ${cardBg}`}>
              <h3 className="mb-4 font-semibold opacity-70">Active Outbound Trends</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                  <XAxis dataKey="name" stroke={darkMode ? "#9ca3af" : "#4b5563"} />
                  <YAxis stroke={darkMode ? "#9ca3af" : "#4b5563"} />
                  <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1f2937' : '#fff', borderColor: darkMode ? '#374151' : '#e5e7eb' }} />
                  <Line type="monotone" dataKey="Amount" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* List of Credits */}
            <h3 className="text-xl font-bold mb-4">Transaction History</h3>
            <div className="space-y-4">
              {credits.map((credit, i) => (
                <motion.div 
                  key={credit._id}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className={`p-4 rounded-xl flex items-center justify-between shadow-sm border ${cardBg}`}
                >
                  <div>
                    <h4 className={`text-lg font-bold ${credit.isPaid ? 'line-through opacity-50' : ''}`}>
                      {credit.personName}
                    </h4>
                    <div className="flex items-center text-sm opacity-60 mt-1">
                      <Clock size={14} className="mr-1" /> 
                      Last updated: {new Date(credit.updatedAt).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className={`text-xl font-bold ${credit.isPaid ? 'opacity-50' : ''}`}>
                      ${credit.amount}
                    </span>
                    <button 
                      onClick={() => toggleStatus(credit._id, credit.isPaid)}
                      className={`p-2 rounded-full transition-colors ${credit.isPaid ? 'text-green-500 bg-green-500/10' : 'text-gray-400 hover:text-green-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                      <CheckCircle size={28} />
                    </button>
                  </div>
                </motion.div>
              ))}
              {credits.length === 0 && (
                <p className="text-center opacity-50 py-8">No records found. Add one above!</p>
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}