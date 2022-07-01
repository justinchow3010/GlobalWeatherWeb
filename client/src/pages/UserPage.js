import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Comments from '../components/Comments';
import FavMap from '../components/FavMap';
import DisplayMap from '../components/map';
import Location from '../components/Location';
import Logout from "../util/LogoutCall";
import { useCookies } from 'react-cookie';

export default function UserPage() {
  const [cookies, setCookie] = useCookies(["username"]);
  const [user, setUser] = React.useState({
    name: cookies.username
  }

  )
  return (
    <div className='bg-dark'>
      <div className='container'>
          <Location />
          <nav className="container navbar navbar-expand-lg navbar-dark bg-dark justify-content-center">
            <a className="navbar-brand" >Welcome {user.name}!</a>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                  <Link className="nav-link" to="">Map</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="favoriteLocation">Favorite Location</Link>
                </li>
              </ul>
              <button className="nav-link justify-content-end" onClick={() => { Logout() }}>Logout</button>
            </div>
          </nav>
          <Routes>
            <Route path='' element={<DisplayMap />} />
            <Route path='favoriteLocation' element={<FavMap />} />
          </Routes>
        <div className='container'>
          <Comments />
        </div>

        {/* <div className='container' style={{'height':'35rem'}}>
         <PastHoursChart location={"Hong Kong"} /> 
      </div> */}

      </div>

    </div>

  )
}
