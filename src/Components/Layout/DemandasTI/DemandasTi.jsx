import { Outlet } from "react-router";
import { Link } from "react-router";
import { UserContext } from "../../../context/UserContextFile";
import { useContext } from "react";

const DemandasTi = () => {
  let { scopo } = useContext(UserContext);
  
  return (
    <div id="DemandasTi" className="content">
      
      <div className="p-10">
        <div className="flex gap-3">
          <div className="px-2 py-1 bg-primary-500 hover:bg-primary-600 text-md font-bold text-white rounded-t-lg actived">
            <Link to={"/demandasti/"}>
              <h3>Demandas do Usuário</h3>
            </Link>
          </div>
          {scopo == "admin" || scopo == "tecnico" ? (
            <div className="px-2 py-1 bg-primary-500 hover:bg-primary-600 text-md font-bold text-white rounded-t-lg">
              <Link to={"alldemandas"}>
                <h3>Todas Demandas</h3>
              </Link>
            </div>
          ) : (
            ""
          )}
          <div className="px-2 py-1 bg-primary-500 hover:bg-primary-600 text-md font-bold text-white rounded-t-lg">
            <Link to={"historicodemandas"}>
              <h3>Histórico de Demandas</h3>
            </Link>
          </div>
        </div>
        <div className="ring-1 ring-black p-10 rounded-b-sm bg-green-50">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
};

export default DemandasTi;
