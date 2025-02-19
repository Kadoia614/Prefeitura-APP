import { Outlet, Navigate } from "react-router";
import { useContext, useEffect } from "react";
import { AppContext } from "../../context/Context";
import API from "../../../service/API";

const ProtectRoutes = () => {
  const { auth, setAuth } = useContext(AppContext);

  const authUser = async () => {
    const response = await API.get("/verifyAuth");
    if (response.status === 200) {
      setAuth(true);
    } else {
      setAuth(false);
    }

  };

  useEffect(() => {
    authUser();
  }, []);

  return (
    <div className="container mx-auto h-full bg-white w-full px-10 py-10 rounded-sm">
      {auth ? <Outlet /> : <Navigate to="/login" />}
    </div>
  );
};

export default ProtectRoutes;
