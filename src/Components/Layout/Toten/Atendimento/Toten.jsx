import { Outlet } from "react-router";

const Toten = () => {
  return (
    <div className="content">
      <div>
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default Toten;
