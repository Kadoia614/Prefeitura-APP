import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import {AppContext} from "../../context/Context";


import logoItap from "/prefeitura-de-itapecerica-da-serra.jpg";
import API from "/src/../service/API";

import PrimaryButton from "../shared/PrimaryButton";

// eslint-disable-next-line react/prop-types
const Login = () => {
  const teste = true;

  const {setAuth} = useContext(AppContext)
  const {setScopo} = useContext(AppContext)

  let [error, setError] = useState();
  let [email, setEmail] = useState();
  let [pass, setPass] = useState();
  let [permanecerConectado, setPermanecerConectado] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (userMail, userPass) => {
    setEmail(document.getElementById("Email").value);
    setPass(document.getElementById("Password").value);

    try {

      if (!teste) {
        if (!/^[A-Z0-9._%+-]+@itapecerica+\.sp\.gov\.br$/i.test(email)) {
          throw { status: 403, message: "Email inválido" };
        }
      }

      const response = await API.post("/login", {
        email: userMail,
        pass: userPass,
        permanecerConectado: permanecerConectado,
      });
      setScopo(response.data.scopo)
      setAuth(true)

      if (response.data.firstLogin) {
        navigate("/alterarsenha");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err);
      setAuth(false)

    }
  };

  const renderPostit = () => {
    if (error != undefined) {
      return (
        <div className="bg-red-500 text-white font-bold text-center py-4 mt-4 animate-down">
          <p>Ops, algo deu errado</p>
          <h1>{error.status}</h1>
          <p>{renderPostitMessage(error)}</p>
        </div>
      );
    }
  };

  const renderPostitMessage = (loginResult) => {
    switch (loginResult.status) {
      case 400:
        return "Email e Senha devem estar preenchidos";
      case 401:
        return "Ops, email ou senha inválidos";
      default:
        return "Parece que tivemos um problema " + loginResult.message;
    }
  };

  return (
    <div
      className="w-full h-dvh bg-white py-20 sm:py-30"
      id="LoginContainer"
      onKeyDown={(event) => {
        event.key === "Enter" ? handleLogin(email, pass) : "";
      }}
    >
      <div className="mx-auto sm:w-full sm:max-w-sm p-10 sm:p-0">
        <img
          className="mx-auto h-40 w-auto"
          src={logoItap}
          alt="Logo de Itapecerica da Serra"
        />
        <h2 className="mt-5 text-center text-4xl font-bold tracking-tight text-gray-900">
          Login
        </h2>
        {renderPostit()}
        <div className="mx-auto mt-5 sm:w-full sm:max-w-sm">
          <div className="mt-5">
            <label htmlFor="Email" className="font-bold">
              Email
            </label>
            <input
              type="email"
              id="Email"
              className="input bg-white"
              autoComplete="false"
              placeholder="emailexemple@example.com.br"
              onKeyUp={(e) => setEmail(e.target.value)}
            ></input>
          </div>
          <div className="mt-5">
            <label htmlFor="Password" className="font-bold">
              Password
            </label>
            <input
              type="password"
              id="Password"
              className="input bg-white"
              placeholder="type your password"
              onKeyUp={(e) => setPass(e.target.value)}
            ></input>
          </div>
          <div className="mt-4">
            <input
              type="checkbox"
              id="Conectado"
              placeholder="type your password"
              onChange={(e) => setPermanecerConectado(e.target.checked)}
            ></input>
            <label htmlFor="Conectado" className="ml-2">Permanecer conectado?</label>
          </div>
          <div>
            <PrimaryButton
              text="Fazer Login"
              handler={() => handleLogin(email, pass)}
            />
          </div>
          <div className="mt-2">
            <a
              href="mailto:miguel.moraes@itapecerica.sp.gov.br.com"
              className="text-primary hover:text-primaryhover"
            >
              Esqueceu a Senha?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
