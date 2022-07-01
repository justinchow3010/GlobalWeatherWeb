
import {Navigate, Outlet, Route} from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Login from '../pages/Login';
function ProtectedRoute(){
    const [cookies, setCookie] = useCookies(["username"]);
    const role = cookies.username;
    if(!role)
        return <Navigate to="/login"/>
    else return <Outlet/>


}
export default ProtectedRoute;