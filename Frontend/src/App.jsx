import { useState } from "react";
import Auth from "./Components/Auth/Auth";
// Import your Dashboard component here once you separate it
// import Dashboard from "./Components/Dashboard/Dashboard"; 

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505]">
      {!isAuthenticated ? (
        // When Auth succeeds, it triggers this function and changes the state
        <Auth onAuthSuccess={() => setIsAuthenticated(true)} />
      ) : (
        // Replace this div with your actual Dashboard UI!
        <div className="text-white p-10 flex flex-col items-center justify-center h-screen text-2xl">
          Welcome to the Dashboard! 
          <button onClick={() => setIsAuthenticated(false)} className="mt-4 text-sm text-red-500">Log Out</button>
        </div>
      )}
    </div>
  );
}

export default App;