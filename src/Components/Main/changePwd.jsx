import { useState } from "react";

import API from "/src/../service/API";
import AlertInfo from "../shared/alert/AlertInfo";

import PrimaryButton from "../shared/PrimaryButton";

// eslint-disable-next-line react/prop-types
const ChangePwd = () => {
  let [email, setEmail] = useState();
  let [newPass, setNewPass] = useState();
  let [oldPass, setOldPass] = useState();
  let [status, setStatus] = useState();

  const handleAlterPwd = async (userMail, userOldPass, userNewPass) => {
    try {
      let response = await API.post("/changePwd", {
        email: userMail,
        oldPass: userOldPass,
        newPass: userNewPass,
      });
      console.log(response.data)
      setStatus({
        status: response.status,
        type: "success",
        message: response.data
      });
    } catch (error) {
      setStatus({
        status: error.status,
        type: "danger",
        message: error.message,
      });
    }
  };

  return (
    <div
      id="AlterPwdContainer"
      className="bg-white"
      onKeyDown={(event) => {
        event.key === "Enter" ? handleAlterPwd(email, oldPass, newPass) : "";
      }}
    >
      <div className="grid md:grid-cols-2 grid-cols-1">
        <div className="text-center hidden md:block">
          <h2 className="mt-5 text-center text-4xl font-bold tracking-tight text-gray-900">
            Altere sua senha
          </h2>
          <div>
            <p>
              Para sua segurança, jamais compartilhe sua senha com outras
              pessoas, ela é única, intransferível e somente você tem
              conhecimento, qualquer casualidade é de sua responsabilidade.
            </p>
            <h4>
              Para alterar sua senha, insira seu email, a senha antiga e a nova
              senha.
            </h4>
          </div>
        </div>
        <div>
          <div>
            <h1 className="text-4xl font-bold my-4 text-center">Alterar Senha</h1>
            {status ? (
              <AlertInfo
                tipo={status.type}
                menssagem={`${status.message}`}
                setAlert={setStatus}
              />
            ) : (
              ""
            )}
            <div>
              <fieldset className="mt-5">
                <label htmlFor="Email" className="block font-bold">Email</label>
                <input
                className="block w-full rounded-sm bg-white px-3 py-1 mt-2"
                  type="email"
                  id="Email"
                  placeholder="emailexemple@example.com.br"
                  onKeyUp={(e) => setEmail(e.target.value)}
                ></input>
              </fieldset>
              <fieldset className="mt-5">
                <label htmlFor="Password" className="block font-bold">Senha Antiga</label>
                <input
                className="block w-full rounded-sm bg-white px-3 py-1 mt-2"
                  type="password"
                  id="Password"
                  placeholder="type your old password"
                  onKeyUp={(e) => setOldPass(e.target.value)}
                ></input>
              </fieldset>
              <fieldset className="mt-5">
                <label htmlFor="Password" className="block font-bold">Nova Senha</label>
                <input
                className="w-fullblock w-full rounded-sm bg-white px-3 py-1 mt-2"
                  type="password"
                  id="Password"
                  placeholder="change your new password"
                  onKeyUp={(e) => setNewPass(e.target.value)}
                ></input>
              </fieldset>
              <div>
                <PrimaryButton
                  text="Fazer Login"
                  handler={() => handleAlterPwd(email, oldPass, newPass)}
                />
                <a href="mailto:miguel.moraes@itapecerica.sp.gov.br.com" className="block mt-4 text-primary  hover:text-primaryhover">
                  Esqueceu a Senha?
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePwd;
