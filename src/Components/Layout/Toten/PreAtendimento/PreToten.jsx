import { useEffect, useState } from "react";
import API from "../../../../../service/API";

import Title from "../../../shared/Title";

import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { GiConfirmed } from "react-icons/gi";
import { InputSwitch } from "primereact/inputswitch";

const PreToten = () => {
  let [municipe, setMunicipe] = useState("");
  let [dpto, setDpto] = useState("");
  let [servico, setServico] = useState("");
  let [preferencial, setPreferencial] = useState(false);
  let [observations, setObservations] = useState("");

  let [rSenha, setRSenha] = useState("");

  let [ip, setIp] = useState([]);
  let [status, setStatus] = useState([]);
  let [senhas, setSenhas] = useState([]);

  const fetchData = async () => {
    try {
      const response = await API.get("/toten");
      setStatus(response.data.status);
      setSenhas(response.data.senhas.senha);
      setIp(response.data.ip);
    } catch (error) {
      console.error(error);
    }
  };

  const handdleGerarSenha = async () => {
    try {
      const response = await API.post("/toten", {
        municipe: municipe,
        dpto: dpto,
        service: servico,
        preferencial: preferencial,
        observations: observations,
      });
      alert(JSON.stringify(response.data))
    } catch (error) {
      console.error(error.message);

    }
  };

  useEffect(() => {
    fetchData();
    setInterval(() => {
      fetchData();
    }, 5000);
  }, []);

  return (
    <div className="content">
      <div className="flex md:flex-row flex-col">
        <div className="w-full flex flex-col">
          <Title>Pré atendimento</Title>
          <div className="px-8 my-8 md:border-r-1 border-primary-500 h-full">
            <div>
              <label htmlFor="">Nome do munícipe</label>
              <InputText
                value={municipe}
                className="w-full input ring-2 ring-primary-200 mt-2"
                onChange={(e) => setMunicipe(e.target.value)}
                placeholder="Nome do munícipe"
              />
            </div>

            <div className="w-full flex md:flex-row flex-col gap-4">
              <div className="flex flex-col w-full gap-4 mt-4">
                <div>
                  <label htmlFor="">Departamento</label>
                  <InputText
                    value={dpto}
                    className="w-full input ring-2 ring-primary-200 mt-2"
                    onChange={(e) => setDpto(e.target.value)}
                    placeholder="Nome do munícipe"
                  />
                </div>

                <div>
                  <label htmlFor="">Serviço</label>
                  <InputText
                    value={servico}
                    className="w-full input ring-2 ring-primary-200 mt-2"
                    onChange={(e) => setServico(e.target.value)}
                    placeholder="Nome do munícipe"
                  />
                </div>
              </div>

              <div className="w-full mt-4">
                <label htmlFor="" className="block">
                  Preferencial
                </label>

                <InputSwitch
                  className="mt-2"
                  checked={preferencial}
                  onChange={(e) => setPreferencial(e.value)}
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="">Observação</label>
              <InputTextarea
                value={observations}
                onChange={(e) => setObservations(`${e.target.value}`)}
                placeholder={`Senha gerada por ${ip}`}
                rows={5}
                cols={30}
                className="w-full input ring-2 ring-primary-200 mt-2"
              />
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col">
          <Title>Senhas</Title>
          <div className="px-8 my-8 md:border-l-1 h-full border-primary-500">
            <div className="flex flex-row items-end">
              <div>
                <label htmlFor="">Retornar Senha:</label>
                <div className="flex items-center">
                  <InputText
                    value={rSenha}
                    onChange={(e) => setRSenha(e.target.value)}
                    className="w-23 input ring-2 ring-primary-200 mt-2"
                    placeholder="N° 000"
                  />
                  <Button
                    className="btn-primary p-4 h-9 ml-4 w-10 mt-2"
                    label={<GiConfirmed className="mx-auto" />}
                  />
                </div>
              </div>
              <div className="w-full ml-4">
                <Button
                  onClick={() => {
                    handdleGerarSenha();
                  }}
                  className="btn-primary"
                  label="Gerar Senha"
                />
              </div>
            </div>
            <div className="xl:w-2xl w-full overflow-auto">
              <ul className="w-full min-w-96 mt-8">
                <li>
                  <p className="flex justify-between text-red-500">
                    Total de senhas c/ mais 30 min espera: <span>0</span>
                  </p>
                </li>
                <li>
                  <p className="flex justify-between">
                    Total de senhas na espera: <span>{status.espera}</span>
                  </p>
                </li>
                <li>
                  <p className="flex justify-between">
                    Total de senha em atendimento:{" "}
                    <span>{status.atendimento}</span>
                  </p>
                </li>
                <li>
                  <p className="flex justify-between">
                    Total de senhas atendidas: <span>{status.atendidas}</span>
                  </p>
                </li>
                <li>
                  <p className="flex justify-between">
                    Total de senhas canceladas: <span>{status.canceladas}</span>
                  </p>
                </li>
                <li>
                  <p className="flex justify-between">
                    Total de senhas preferenciais:{" "}
                    <span>{status.prioridade}</span>
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t-2 border-primary-500 p-8">
        <div>
          <label htmlFor="">Informações do complexo administrativo PMIS</label>
          <InputTextarea
            value={municipe}
            disabled
            rows={5}
            cols={30}
            className="w-full input ring-2 ring-primary-200 mt-2"
          />
        </div>
      </div>
    </div>
  );
};
export default PreToten;
