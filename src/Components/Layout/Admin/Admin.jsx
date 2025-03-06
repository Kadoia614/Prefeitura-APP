import { Outlet } from "react-router";
import { Link } from "react-router";

const Admin = () => {
  return (
    <div>
      <h1
        className="text-center font-bold
            md:text-3xl sm:text-2xl text-xl"
      >
        Com grandes poderes vêm grandes responsabilidades
      </h1>
      <div className="flex gap-3 mt-10">
        <div className="px-2 py-1 bg-primary-500 hover:bg-primaryhover text-md font-bold text-white rounded-t-lg">
          <Link to={"/admin/"}>
            <h3>Painel de Admin</h3>
          </Link>
        </div>
        <div className="px-2 py-1 bg-primary-500 hover:bg-primaryhover text-md font-bold text-white rounded-t-lg">
          <Link to={"service"}>
            <h3>Painel de Serviços</h3>
          </Link>
        </div>
        <div className="px-2 py-1 bg-primary-500 hover:bg-primaryhover text-md font-bold text-white rounded-t-lg">
          <Link to={"setor"}>
            <h3>Setores</h3>
          </Link>
        </div>
      </div>
      <div className="ring-1 ring-black p-10 rounded-b-sm">
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default Admin;
