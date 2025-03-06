import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Avatar } from "primereact/avatar";
import { useNavigate } from "react-router";
import { useContext, useEffect } from "react";

import { UserContext } from "/src/context/UserContext";

import API from "../../../service/API";

const Header = () => {
  let { auth, setAuth } = useContext(UserContext);
  let { userServices, setUserServices } = useContext(UserContext);
  let navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await API.get("/services");
      const services = response.data.services;
      setUserServices(services);
    } catch (error) {
      console.error("Failed to fetch services:", error);
    }
  };

  useEffect(() => {
    if (auth) {
      fetchData();
    }
  }, [auth]);

  const logout = () => {
    localStorage.removeItem("token");
    setAuth(false);
    navigate("/login");
  };

  return (
    <>
      <header className="bg-primary-500 text-white font-bold h-20 flex items-center justify-between flex-row py-4 px-8">
        <a href="#" className="w-16 bg-white rounded-md">
          <img src="/public/logo.png" alt="" className="h-12 m-auto p-0" />
        </a>
        <div className="flex flex-row justify-between items-center">
          {auth ? (
            <>
              <div className="flex flex-row items-center mr-10">
                {userServices.length > 0 && (
                  <Menu as={"div"} className="relative">
                    <MenuButton id="services-menu-button" className="cursor-pointer">
                      Services
                    </MenuButton>
                    <MenuItems
                      transition
                      className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                    >
                      {userServices.map((serviceItem) => (
                        <MenuItem key={serviceItem.id}>
                          <a href={serviceItem.url} className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden">
                            {serviceItem.name}
                          </a>
                        </MenuItem>
                      ))}
                    </MenuItems>
                  </Menu>
                )}
              </div>
              <Menu as={"div"} className="relative">
                <div>
                  <MenuButton id="user-menu-button" className="cursor-pointer">
                    <Avatar label="U" size="xlarge" className="w-10 h-10" />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                    >
                      Your Profile
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                    >
                      Settings
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 bg-red-200 data-focus:bg-red-300 data-focus:outline-hidden"
                      onClick={logout}
                    >
                      Sign out
                    </a>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </>
          ) : (
            <h2 className="text-xl">Itapecerica da Serra</h2>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;