import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, KeyRound, AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";

export default function Auth({ onAuthSuccess }) {
  const [step, setStep] = useState(0); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState(""); // Replaces the alert()

  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const savedEmail = localStorage.getItem("userEmail");
    const savedPass = localStorage.getItem("userPass");

    if (!savedEmail) {
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userPass", password);
      setStep(1); 
    } else if (email === savedEmail && password === savedPass) {
      setStep(1);
    } else {
      setError("Invalid Email or Password. Please check your credentials and try again.");
    }
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    const savedPin = localStorage.getItem("userPin");

    if (!savedPin) {
      localStorage.setItem("userPin", pin);
      onAuthSuccess(email); 
    } else if (pin === savedPin) {
      onAuthSuccess(email);
    } else {
      setError("Incorrect Security PIN. Access denied.");
      setPin(""); 
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050505] overflow-hidden flex items-center justify-center p-4 sm:p-8 font-sans text-white">
      
      {/* --- Animated Ambient Background Orbs --- */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-72 h-72 sm:w-96 sm:h-96 bg-blue-600 rounded-full blur-[100px] sm:blur-[128px] opacity-30 pointer-events-none"
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-10%] right-[-10%] w-72 h-72 sm:w-96 sm:h-96 bg-purple-600 rounded-full blur-[100px] sm:blur-[128px] opacity-20 pointer-events-none"
      />

      {/* --- Main Glassmorphism Form Container --- */}
      <div className="relative z-10 w-full max-w-md">
        
        {/* Header Icon */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-500 p-[2px] shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <div className="w-full h-full bg-[#0a0a0a] rounded-2xl flex items-center justify-center">
              <ShieldCheck className="text-white" size={32} />
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* STEP 0: LOGIN */}
          {step === 0 && (
            <motion.form 
              key="login"
              initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }} 
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} 
              exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onSubmit={handleLogin} 
              className="backdrop-blur-2xl bg-white/[0.02] border border-white/[0.05] p-8 rounded-[2rem] shadow-2xl"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2">Welcome Back</h2>
                <p className="text-gray-400 text-sm">Enter your credentials to access your vault</p>
              </div>
              
              <div className="space-y-4">
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                  <input 
                    type="email" placeholder="Email Address" required 
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-white placeholder:text-gray-600"
                  />
                </div>
                
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                  <input 
                    type="password" placeholder="Password" required 
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-white placeholder:text-gray-600"
                  />
                </div>

                <button type="submit" className="group relative w-full flex items-center justify-center gap-2 bg-white text-black font-semibold py-4 rounded-2xl transition-all hover:bg-gray-200 active:scale-[0.98] mt-6">
                  Continue
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.form>
          )}

          {/* STEP 1: PIN CODE */}
          {step === 1 && (
            <motion.form 
              key="pin"
              initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }} 
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} 
              exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onSubmit={handlePinSubmit} 
              className="backdrop-blur-2xl bg-white/[0.02] border border-white/[0.05] p-8 rounded-[2rem] shadow-2xl flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
                <KeyRound className="text-blue-400" size={28} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2">Secure PIN</h2>
              <p className="text-gray-400 text-sm mb-8 text-center">Enter your 4-digit security code</p>
              
              <input 
                type="password" maxLength="4" pattern="\d{4}" required inputMode="numeric"
                value={pin} onChange={(e) => setPin(e.target.value)}
                className="w-full text-center text-4xl sm:text-5xl tracking-[0.5em] py-6 rounded-2xl bg-black/40 border border-white/10 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-white font-mono placeholder:text-transparent"
                placeholder="****"
                autoFocus
              />
              
              <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 rounded-2xl transition-all hover:opacity-90 active:scale-[0.98] mt-8 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                Unlock Dashboard
              </button>
              
              <button type="button" onClick={() => setStep(0)} className="mt-6 text-sm text-gray-500 hover:text-white transition-colors">
                ← Back to Login
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* --- Custom Error Modal --- */}
      <AnimatePresence>
        {error && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setError("")} // Click outside to close
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-[#111113] border border-red-500/30 p-6 sm:p-8 rounded-3xl shadow-[0_20px_60px_rgba(239,68,68,0.15)] flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mb-5 border border-red-500/20">
                <AlertTriangle className="text-red-500" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Access Denied</h3>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">{error}</p>
              <button 
                onClick={() => setError("")} 
                className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-semibold transition-colors active:scale-[0.98]"
              >
                Try Again
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}