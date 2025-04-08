import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { Toast } from "primereact/toast";

import API from "../../../service/API";

import { UserContext } from "/src/context/UserContextFile";
import { InputText } from "primereact/inputtext";
import { MdOutlinePassword } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { Button } from "primereact/button";
import Loading from "../shared/Loading";

const Login = () => {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [loading, setLoading] = useState(false);

  let { setAuth, setScopo, scopo } = useContext(UserContext);

  const navigate = useNavigate();
  const toast = useRef(null);

  const Login = async (data) => {
    try {
      let response = await API.post("/login", {
        credentials: {
          password: data.password,
          email: data.email,
        },
      });

      let token = response.data.token;
      await localStorage.setItem("token", token);
      console.log("Authenticado com sucesso");
      setAuth(true);
      setScopo(response.data.scopo);
      console.log("scopo", scopo);
      navigate("/");
    } catch (error) {
      if (error.status === 401) {
        toast.current.show({
          severity: "error",
          summary: "Error Message",
          detail: "Invalid credentials ",
          life: 3000,
        });
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error Message",
          detail: "Error ao realizar login",
          life: 3000,
        });
      }
      setAuth(false);
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
      setAuth(false);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
      }
      console.log(
        `necessário fazer login: ${
          error.response?.data.message || error.message
        }`
      );
    }
  };

  let handleSubmit = () => {
    Login({ email, password });
  };

  useEffect(() => {
    verifyToken();
  }, []);

  if (loading) {
    return <Loading></Loading>;
  }

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
                  <i className="pi pi-user">
                    <FaUser />
                  </i>
                </span>
                <InputText
                  type="text"
                  id="User"
                  placeholder="Usuário"
                  className="w-full input"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </fieldset>

              <fieldset className="flex my-4">
                <span className="p-inputgroup-addon">
                  <MdOutlinePassword />
                </span>
                <input
                  type="password"
                  id="Pwd"
                  placeholder="Senha"
                  className="w-full input"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </fieldset>
              <Button
                onClick={handleSubmit}
                label="Login"
                className="btn-primary w-full text-center"
              />
            </div>
          </div>
        </div>
        <div className="w-90 login-image overflow-hidden"></div>
      </div>
      <Toast ref={toast} />
    </div>
  );
};

export default Login;
