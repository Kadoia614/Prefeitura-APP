import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import API from "../../../service/API";

import { UserContext } from "/src/context/UserContext";
import { InputText } from "primereact/inputtext";
import { MdOutlinePassword } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { Button } from 'primereact/button';

const Login = () => {
  let [user, setUser] = useState("");
  let [pwd, setPwd] = useState("");
  let [loading, setLoading] = useState(false);

  let { setAuth } = useContext(UserContext);

  const navigate = useNavigate();

  const Login = async (data) => {
    setLoading(true);
    try {
      let response = await API.post("/login", {
        pwd: data.pwd,
        email: data.user,
      });
      let token = response.data.token;
      await localStorage.setItem("token", token);
      setAuth(true)
      navigate("/");
    } catch (error) {
      setAuth(false)
      setLoading(false);
    }
  };

  const verifyToken = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw { message: "Token não encontrado" };
      }

      let response = await API.get("/verifyToken");
      if (response.status === 200) {
        navigate("/");
      }
      setAuth(true);
    } catch (error) {

      setAuth(false)

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
      }
      console.log(
        `necessário fazer login: ${error.response?.data.message || error.message}`
      );
    }
  };

  let handleSubmit = () => {
    Login({ user, pwd });
  };

  useEffect(() => {
    verifyToken();
  }, []);

  return (
    <div className="flex items-start justify-center h-full">
      <div className="mt-35 flex flex-row bg-white px-10">
        <div className="w-90 pb-20 pt-10">
          <div className=" text-center">
            <h1 className="text-3xl">Login</h1>
          </div>
          <div className="border-r-1 border-primary-500">
            <div
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className=" w-full bg-white py-4 px-4 box-border"
            >
              <fieldset className="flex">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-user"><FaUser /></i>
                </span>
                <InputText
                  type="text"
                  id="User"
                  placeholder="Usuário"
                  className="w-full input"
                  onChange={(e) => setUser(e.target.value)}
                />
              </fieldset>

              <fieldset className="flex my-4">
                <span className="p-inputgroup-addon"><MdOutlinePassword /></span>
                <input
                  type="password"
                  id="Pwd"
                  placeholder="Senha"
                  className="w-full input"
                  onChange={(e) => setPwd(e.target.value)}
                />
              </fieldset>
              <Button onClick={handleSubmit} label="Login" className="btn-primary w-full text-center" />

            </div>
          </div>
        </div>
        <div className="w-90 login-image overflow-hidden"></div>
      </div>
    </div>
  );
};

export default Login;
