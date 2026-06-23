// import { BrowserRouter, Routes, Route} from "react-router-dom";

// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import DailyPlanner from "./pages/DailyPlanner";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Analytics
// from "./pages/Analytics";
// function App(){
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
//         <Route path="/planner" element={<ProtectedRoute><DailyPlanner /></ProtectedRoute>} />
//         <Route
//           path="/analytics"
//           element={
//             <ProtectedRoute>
//             <Analytics />
//             </ProtectedRoute>
//           }
//           />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // 🧠 1. Import your AuthProvider here!
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DailyPlanner from "./pages/DailyPlanner";
import ProtectedRoute from "./components/ProtectedRoute"; // Check your file path
import Analytics from "./pages/Analytics";

function App() {
  return (
    // 🧠 2. Wrap everything inside AuthProvider so useAuth() is never undefined
    <AuthProvider> 
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Secured Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/planner" element={<DailyPlanner />} />
            <Route path="/analytics" element={<Analytics />}/>
          </Route>

          {/* Fallback Catch-All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
