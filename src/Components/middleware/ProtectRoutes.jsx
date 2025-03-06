import { Outlet, useNavigate } from "react-router";
import { useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import API from "../../../service/API";

const ProtectRoutes = () => {
  const { setAuth } = useContext(UserContext);
  const navigate = useNavigate();

  const authUser = async () => {
    try {
      let response = await API.get("/verifyToken");
      setAuth(true);
      console.log(response.data);
    } catch (error) {
      setAuth(false);
      console.log(error.message);
      localStorage.removeItem('token');
      navigate('/login')

    }
  };

  useEffect(() => {
    authUser();
  }, []);

  return (
    <div className="container mx-auto h-full bg-white w-full lg:px-10 px-4 py-10 rounded-sm">
      <Outlet />
    </div>
  );
};

export default ProtectRoutes;
