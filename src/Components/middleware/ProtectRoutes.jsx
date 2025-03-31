import { useEffect, useState, useContext } from "react";
import { Outlet, useNavigate } from "react-router";

import { UserContext } from "../../context/UserContextFile";
import API from "../../../service/API";
import Loading from "../shared/Loading";
import Error from "./HandleError";

const ProtectRoutes = () => {
  let { setAuth, setScopo } = useContext(UserContext);
  let [isLoading, setIsLoading] = useState(true); // Para controlar a exibição enquanto carrega
  let [ error, setError ] = useState(null);
  const navigate = useNavigate();

  const authUser = async () => {
    try {
      const response = await API.get("/authuser");
      let responseScopo = response.data.scopo;
      setAuth(true);
      setScopo(responseScopo);
    } catch (err) {
      if (err.status === 401) {
        setAuth(false);
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        console.log(err.response.data.message)
        setError(err)
      }
    } finally {
      setIsLoading(false); // Quando os dados estiverem carregados
    }
  };

  useEffect(() => {
    authUser();
  }, []);

if(error) {
  return (
    <Error Error={error.response.data.message}></Error>
  )
}

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
