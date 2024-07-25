import { Routes, Route } from 'react-router-dom';
import AdminLogin from './pages/admin/login/login';
import AdminDashboard from './pages/admin/dashboard/dashboard';
import Adminerror from './components/admin/Adminerror';
import Userhome from './pages/user/home/userhome';
import UserError from './components/user/userError';
import Layout from './components/user/layout';
import axios from "axios";
axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;


function App() {
  return (
    <Routes>

      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Userhome />} />
        <Route path="*" element={<UserError />} />
      </Route>


      <Route path='/admin/login' element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />}>
      <Route path="/admin/:id" element={<AdminDashboard />}></Route>
        <Route path="*" element={<Adminerror />} />
      </Route>
    </Routes>
  );
}

export default App;
