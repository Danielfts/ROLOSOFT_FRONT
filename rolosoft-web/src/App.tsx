import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import AdminPanel from './components/AdminPanel/AdminPanel';
import RegisterUser from './components/Dashboard/Users/RegisterUser';
import RegisterTournament from './components/Dashboard/Tournaments/RegisterTournament';

const App = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/adminPanel" element={<AdminPanel />} />
      <Route path="/registerUser" element={<RegisterUser />} /> 
      <Route path="/registerTournament" element={<RegisterTournament />} /> 
      <Route path="/" element={<Login />} />
    </Routes>
  </Router>
);

export default App;
