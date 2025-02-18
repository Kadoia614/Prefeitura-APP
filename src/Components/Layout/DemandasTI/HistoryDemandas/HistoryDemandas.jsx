import { useEffect, useState } from "react";
import API from "../../../../../service/API";
import HanlerError from "../../../middleware/HandleError";
import Loading from "../../../shared/Loading";
import Table from "../../../shared/Table/Table";
import TableRow from "../../../shared/Table/TableRow";
import TableCol from "../../../shared/Table/TableCol";
import AlertInfo from "../../../shared/alert/AlertInfo";

const HistoryDemandas = () => {
  let [tableData, setTableData] = useState([]);
  let [loading, setLoading] = useState(true);

  let [alertPostit, setAlertPostit] = useState(null);

  let [error, setError] = useState(false);

  const fetchData = async () => {
    try {
      let response = await API.get("/demandas/user/history");
      return response.data;
    } catch (error) {
      setError(error.status);
    } finally {
      setLoading(false);
    }
  };

  const loadTable = async () => {
    const data = await fetchData();
    console.log(data.demandas)
    setTableData(data.demandas);
  };


  const itemPrioridade = (item) => {
    switch (item) {
      case 0:
        return (
          <span className="text-green-500 font-bold">Baixa prioridade</span>
        );
      case 1:
        return (
          <span className="text-yellow-500 font-bold">Média prioridade</span>
        );
      case 2:
        return <span className="text-red-500 font-bold">Alta prioridade</span>;
      case 3:
        return <span className="text-red-500 font-bold">Gabinete</span>;
      default:
        return <span>Sem prioridade Selecionada</span>;
    }
  };

  const itemStatus = (item) => {
    switch (item) {
      case 0:
        return <span className="text-green-500 font-bold">Aberto</span>;
      case 1:
        return <span className="text-green-500 font-bold">Em atendimento</span>;
      case 2:
        return (
          <span className="text-yellow-500 font-bold">Aguardando Resposta</span>
        );
      case 3:
        return <span className="text-green-500 font-bold">Finalizado</span>;
      default:
        return "Sem prioridade Selecionada";
    }
  };

  useEffect(() => {
    loadTable();
  }, []);

  if (error) {
    return <HanlerError error={error} />;
  }
  if (loading) {
    return <Loading />;
  }

  return (
    <div id="AllDemandasTi">
      <div>
        {/* Alerta */}
        {alertPostit && (
          <AlertInfo
            setAlert={setAlertPostit}
            tipo={alertPostit[1]}
            menssagem={alertPostit[0]}
          />
        )}
      </div>

      <Table
        header={[
          "#",
          "Usuário",
          "Ramal",
          "Setor",
          "Patrimônio",
          "Descrição",
          "Prioridade",
          "Status",
          "Responsável",
        ]}
      >
        {tableData.map((item) => {
          return (
            <TableRow key={item.id}>
              <TableCol className="pr-3">{item.id}</TableCol>
              <TableCol className="pr-3">{item.user.name}</TableCol>
              <TableCol className="pr-3">{item.user.ramal}</TableCol>
              <TableCol className="pr-3">{item.user.setor.name}</TableCol>
              <TableCol className="pr-3">{item.patrimonio}</TableCol>
              <TableCol className="pr-3">{item.description}</TableCol>
              <TableCol className="pr-3">
                {itemPrioridade(item.prioridade)}
              </TableCol>
              <TableCol className="pr-3">{itemStatus(item.status)}</TableCol>
              <TableCol className="pr-3">
                {item.responsavel_user?.name || "Sem responsável"}
              </TableCol>
            </TableRow>
          );
        })}
      </Table>
    </div>
  );
};

export default HistoryDemandas;
