import { Outlet } from "react-router";
import { Link } from "react-router";

const DemandasTi = () => {
  return (
    <div id="DemandasTi" className="content">
      <div className="">
        <div className="flex gap-3">
          <div className="px-2 py-1 bg-primary-500 hover:bg-primary-600 text-md font-bold text-white rounded-t-lg actived">
            <Link to={"/demandasti/"}>
              <h3>Todas Demandas</h3>
            </Link>
          </div>

          <div className="px-2 py-1 bg-primary-500 hover:bg-primary-600 text-md font-bold text-white rounded-t-lg">
            <Link to={"alldemandas"}>
              <h3>Minhas Demandas</h3>
            </Link>
          </div>

          <div className="px-2 py-1 bg-primary-500 hover:bg-primary-600 text-md font-bold text-white rounded-t-lg">
            <Link to={"historicodemandas"}>
              <h3>Histórico de Demandas</h3>
            </Link>
          </div>
        </div>
        <div className=" md:p-10 py-10 rounded-b-sm bg-green-50">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
};

export default DemandasTi;
