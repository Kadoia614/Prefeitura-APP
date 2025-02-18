import { Outlet, Navigate } from "react-router";
import Cookies from "js-cookie";

const ProtectRoutes = () => {
  const token = Cookies.get("token")
    return (
      <div className="container mx-auto h-full bg-white w-full px-10 py-10 rounded-sm">
        {token ? <Outlet /> : <Navigate to='/Login' />}
        
      </div>
    );
  };
  
  export default ProtectRoutes;
  