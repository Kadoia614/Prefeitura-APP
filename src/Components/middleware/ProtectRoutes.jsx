import { useEffect, useState, useContext } from "react";
import { Outlet, useNavigate } from "react-router";

import { UserContext } from "../../context/UserContextFile";
import API from "../../../service/API";
import Loading from '../shared/Loading'

const ProtectRoutes = () => {
  let { setAuth, setScopo } = useContext(UserContext);
  let [isLoading, setIsLoading] = useState(true); // Para controlar a exibição enquanto carrega

  const navigate = useNavigate();

  const authUser = async () => {
    try {
      const response = await API.get("/verifyToken");
      let responseScopo = response.data.scopo;
      setAuth(true);
      setScopo(responseScopo);
    } catch (error) {
      setAuth(false);
      console.log(error.message);
      localStorage.removeItem("token");
      navigate("/login");
    } finally {
      setIsLoading(false); // Quando os dados estiverem carregados
    }
  };

  useEffect(() => {
    authUser();
  }, []);

  if (isLoading) {
    return <Loading></Loading>; // Ou um spinner de loading
  }

  return (
    <div className="container mx-auto">
      <Outlet />
    </div>
  );
};

export default ProtectRoutes;
