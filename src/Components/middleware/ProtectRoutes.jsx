import { Outlet, Navigate } from "react-router";
import Cookies from "js-cookie";

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
      {auth ? <Outlet /> : <Navigate to="/" />}
    </div>
  );
};

export default ProtectRoutes;
