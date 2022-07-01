import './App.css';
import Login from './pages/Login';
import UserPage from './pages/UserPage';
import { AdminMainPage } from './pages/admin';
import DisplayMap  from './components/map';
import HistorialChart from './components/HistorialChart';
import PastHoursChart from './components/Past10HoursWeather';
import "bootstrap/dist/css/bootstrap.min.css";
import {BrowserRouter  as Router,Routes, Route, Navigate} from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
function App() {
  return (
    <div className="App">
      <div className="App-header">
      <p>
          Weather website (CSCI2720 Group 4)
        </p>
      <Router>
      <Routes>
        {/* <ProtectedRoute /> */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute/>}>
          <Route path="/user/*" element={<UserPage />} />
          <Route path="/admin/*" element={<AdminMainPage />} />
        </Route>
      </Routes>
    </Router>
        
      </div>
      {/* <div>
        <PastHoursChart location={"Hong Kong"} />
      </div>
      <div>
        <DisplayMap />
      </div> */}
    </div>
  );
}

export default App;
