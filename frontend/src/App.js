import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import HrInterview from "./components/HrInterview";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/hrinterview" element={<HrInterview />} />
      </Routes>
    </Router>
  );
};

export default App;
