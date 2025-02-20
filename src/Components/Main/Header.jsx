import { useContext, useEffect, useState } from "react";
import {AppContext} from "../../context/Context";
import PropTypes from "prop-types";
import { useNavigate, Link } from "react-router";
import { FaUser } from "react-icons/fa";

import API from "/src/../service/API";
import Cookies from 'js-cookie';

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

import logoItap from "/prefeitura-de-itapecerica-da-serra.jpg";

const Header = () => {
  const {auth, setAuth} = useContext(AppContext)
  const [services, setServices] = useState([]); // Inicializado como array vazio
  const navigate = useNavigate();

  // Função para buscar dados da API
  const fetchData = async () => {
    try {
      const response = await API.get("/services");
      setServices(response.data.services); // Atualiza o estado com os serviços
    } catch (error) {
      if (error.status != 401) {
        alert("Erro ao buscar serviços: " + error.message);
      }
      return []; // Retorna um array vazio em caso de erro
    }
  };

  const authUser = async () => {
    const response = await API.get("/verifyAuth");
    if (response.status === 200) {
      setAuth(true);
    } else {
      setAuth(false);
    }

  };

  // Função para configurar os serviços
  const getService = async () => {
    await fetchData(); // Aguarda a resposta do fetchData
  };

  // Função para logout
  const Logout = async () => {
    try {
      const response = await API.post("/logout");
      console.log(response.status)
      navigate("/login");
      Cookies.remove('token', { path: '/api' });
      setAuth(false)
    } catch (error) {
      alert("Erro ao fazer logout: " + error.message);
    }
  };

  // useEffect para carregar serviços ao montar o componente
  useEffect(() => {
    authUser();
  }, []);

  useEffect(() => {
    auth ? getService() : '';
    
  }, [auth]);

  return (
    <header id="Header" className=" drop-shadow-sm shadow-md shadow-gray-300">
      <Disclosure as={"nav"} className="bg-white">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-2">
          <div className="relative flex items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-sm p-2 text-primary hover:text-primaryhover focus:ring-2 focus:ring-primaryhover focus:outline-hidden focus:ring-inset">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Abrir menu</span>
                <Bars3Icon
                  aria-hidden="true"
                  className="block size-6 group-data-open:hidden"
                />
                <XMarkIcon
                  aria-hidden="true"
                  className="hidden size-6 group-data-open:block"
                />
              </DisclosureButton>
            </div>
            <div className="flex flex-1 items-center justify-center md:items-center md:justify-between">
              <div className="flex shrink-0 items-center">
                <img
                  src={logoItap}
                  alt="Logo itapecerica da Serra"
                  id="Logo"
                  className="h-15 w-auto rounded-sm"
                />
              </div>
              <div className="hidden md:flex md:ml-6">
                {auth ? (
                  <>
                    {services.map((service) => (
                      <Link
                        key={service.id}
                        to={service.url}
                        className="nav-link"
                      >
                        {service.name}
                      </Link>
                    ))}

                    <Link
                      to={"/"}
                      className="nav-link"
                    >
                      Todos os serviços
                    </Link>
                    <div className="absolute inset-y-0 right-0 flex flex-col items-center pr-2 md:static md:inset-auto md:ml-6 sm:pr-0">
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <MenuButton className="relative cursor-pointer p-2 text-primary hover:text-primaryhover flex rounded-full bg-white hover:bg-white focus:ring-primaryhover focus:ring-2 hover:ring-primaryhover hover:ring-2 ">
                            <span></span>
                            <span></span>
                            <FaUser className="h-6 w-6" />
                          </MenuButton>
                        </div>
                        <MenuItems
                          transition
                          className="absolute text-center right-0 z-10 mt-2 w-44 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                        >
                          <MenuItem>
                            <a
                              href=""
                              className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                            >
                              Meu perfil
                            </a>
                          </MenuItem>
                          <MenuItem>
                            <Link
                              to={"/alterarsenha"}
                              className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                            >
                              Alterar senha
                            </Link>
                          </MenuItem>
                          <MenuItem>
                            <button
                              type="button"
                              className="cursor-pointer w-30 mt-3 rounded-sm px-2 py-1 text-md font-bold text-white bg-red-500 data-focus:bg-red-300 data-focus:outline-hidden"
                              onClick={() => Logout()}
                            >
                              Logout
                            </button>
                          </MenuItem>
                        </MenuItems>
                      </Menu>
                    </div>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="px-2 py-1 text-lg font-bold text-primary hover:text-primaryhover rounded-sm"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <DisclosurePanel className="md:hidden">
          <div className="space-y-1 pc-2 pt-2 pb-3">
            {auth ? (
              <>
                {services.map((service) => (
                  <Link
                    key={service.id}
                    to={service.url}
                    className="nav-link"
                  >
                    {service.name}
                  </Link>
                ))}
                <hr className="text-black"/>
                <Link
                  to={"/"}
                  className="px-2 py-1 text-lg font-bold text-primary hover:text-primaryhover rounded-sm"
                >
                  Todos os serviços
                </Link>
                <div className="block inset-y-0 right-0 flex-col items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <MenuButton className="relative cursor-pointer p-2 text-primary hover:text-primaryhover flex rounded-full bg-white hover:bg-white focus:ring-primaryhover focus:ring-2 hover:ring-primaryhover hover:ring-2 ">
                        <span></span>
                        <span></span>
                        <FaUser className="h-6 w-6" />
                      </MenuButton>
                    </div>
                    <MenuItems
                      transition
                      className="absolute text-center left-0 z-10 mt-2 w-44 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                    >
                      <MenuItem>
                        <a
                          href=""
                          className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                        >
                          Meu perfil
                        </a>
                      </MenuItem>
                      <MenuItem>
                        <Link
                          to={"/alterarsenha"}
                          className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                        >
                          Alterar senha
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <button
                          type="button"
                          className=" cursor-pointer w-30 mt-3 rounded-sm px-2 py-1 text-md font-bold text-white bg-red-500 data-focus:bg-red-300 data-focus:outline-hidden"
                          onClick={() => Logout()}
                        >
                          Logout
                        </button>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="px-2 py-1 text-lg font-bold text-white hover:bg-white hover:text-primaryhover rounded-sm"
              >
                Login
              </Link>
            )}
          </div>
        </DisclosurePanel>
      </Disclosure>
    </header>
  );
};
Header.propTypes = {
  auth: PropTypes.any
};

export default Header;
