import { useEffect, useState, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { CiTrash } from "react-icons/ci";

import API from "../../../../../../service/API";
import moment from "moment";

import { UserContext } from "../../../../../context/UserContextFile";
import Title from "../../../../shared/Title";

const AllToten = () => {
  let [senhas, setSenhas] = useState([]);
  let [ip, setIp] = useState([]);
  let [status, setStatus] = useState([]);
  let { scopo } = useContext(UserContext);

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

  useEffect(() => {
    fetchData();
    setInterval(() => {
      fetchData();
    }, 5000);
  }, []);

  const statusTemplate = (rowData) => {
    switch (rowData.status) {
      case 1:
        return <span className="text-yellow-500">Aguardando</span>;
      case 2:
        return <span className="text-green-500">Em Atendimento</span>;
      case 3:
        return <span className="text-green-500">Atendido</span>;
      case 4:
        return <span className="text-red-500">Cancelada</span>;
      default:
        return <span className="text-red-500">Desconhecido</span>;
    }
  };

  const timeTemplate = (rowData) => {
    moment.locale("pt-br");
    return rowData.finalizado
      ? rowData.finalizado
      : moment(rowData.data_criacao, "DD/MM/YYYY HH:mm:ss").fromNow();
  };

  return (
    <>
      <Title>Histórico de atendimentos</Title>
      <div className="flex xl:flex-row flex-col justify-around p-8 bg-white">
        <div className="xl:w-2xl w-full  overflow-auto xl:px-5 p-5">
          <ul className="w-full min-w-96 ring-primary-500 ring-1 rounded-sm p-4">
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
                Total de senha em atendimento: <span>{status.atendimento}</span>
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
                Total de senhas preferenciais: <span>{status.prioridade}</span>
              </p>
            </li>
          </ul>
        </div>
        <div className="w-full xl:pl-12 xl:mt-0 mt-10">
          <DataTable
            value={senhas}
            rowHover
            paginator
            rows={10}
            rowsPerPageOptions={[10, 25, 50]}
            stripedRows
            tableStyle={{ minWidth: "40rem" }}
          >
            <Column field="senha" header="Senha" />
            <Column field="municipe" header="Municipe" />
            <Column field="prioridade" header="Prioridade" />
            <Column field="responsavel" header="Guichê" />
            <Column field="status" body={statusTemplate} header="Status" />
            <Column field="data_criacao" body={timeTemplate} header="Timer" />
            <Column
              header="Cancelar"
              body={
                <Button
                  label={<CiTrash />}
                  className="btn-danger my-2 text-2xl"
                />
              }
            ></Column>
          </DataTable>
          <div className="flex justify-between">
            <p className="text-sm text-gray-500 text-end">
              Atualizada a cada 10 segundos.
            </p>

            <p className="text-sm text-gray-500 text-end">{scopo}: {ip}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllToten;
