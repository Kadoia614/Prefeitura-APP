import { useContext, useEffect, useState } from "react";
import API from "../../../../../service/API";
import HanlerError from "../../../middleware/HandleError";
import Loading from "../../../shared/Loading";
import Table from "../../../shared/Table/Table";
import TableRow from "../../../shared/Table/TableRow";
import TableCol from "../../../shared/Table/TableCol";
import ActionButton from "../../../shared/Table/ActionButton";
import AlertInfo from "../../../shared/alert/AlertInfo";
import { AppContext } from "/src/context/Context";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

const AllDemandas = () => {
  let {scopo, setScopo} = useContext(AppContext)

  let [tableData, setTableData] = useState([]);
  let [loading, setLoading] = useState(true);

  let [excludeModalOpen, setExcludeModalOpen] = useState(false);
  let [excludeModal, setExcludeModal] = useState(true);

  let [assumeModalOpen, setAssumeModalOpen] = useState(false);
  let [assumeModal, setAssumeModal] = useState([]);

  let [alertPostit, setAlertPostit] = useState(null);

  let [error, setError] = useState(false);

  const fetchData = async () => {
    try {
      let response = await API.get("/demandas");
      console.log(response.data)
      return response.data;
    } catch (error) {
      setError(error.status);
    } finally {
      setLoading(false);
    }
  };

  const loadTable = async () => {
    const data = await fetchData();

    setTableData(data.demandas);
    setScopo(data.scopo);
  };

  //#region Assume items

  const toAssume = (item) => {
    setAssumeModal(item.id);
    setAssumeModalOpen(true);
  };

  const assumeItem = async (id) => {
    try {
      let response = await API.put(`/demandas/assumir/${id}`);
      setAlertPostit([
        `${response.message || "Alteração bem sucedida"}`,
        "success",
      ]);
      setAssumeModal(null);
      return;
    } catch (error) {
      setAlertPostit([
        `${error.message || "Ops, tivemos um problema"}`,
        "danger",
      ]);
      return;
    } finally {
      setAssumeModalOpen(false);
      loadTable();
    }
  };
  //#enregion Assume items

  //#region REMOVE ITEMS

  const toRemove = (item) => {
    setExcludeModal(item.id);
    setExcludeModalOpen(true);
  };

  const removeItem = async (id) => {
    try {
      let response = await API.delete(`/demandas/${id}`);

      setAlertPostit([
        `${response.message || "Salvo com sucesso!"}`,
        "success",
      ]);

      setExcludeModal(null);

      return;
    } catch (error) {
      setAlertPostit([
        `${error.message || "Ops, tivemos um problema"}`,
        "danger",
      ]);
      return;
    } finally {
      setExcludeModalOpen(false);
      loadTable();
    }
  };

  //#endregion REMOVE ITEMS

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

    setInterval(() => {
      loadTable();
    }, 10000)
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
          ...(scopo === "admin" ? [["Excluir"]] : [["Assumir"]]),
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
              {scopo === "admin" ? (
                <TableCol>
                  <ActionButton
                    item={item}
                    action={"delete"}
                    handdler={toRemove}
                    type={"btn-danger"}
                  ></ActionButton>
                </TableCol>
              ) : (
                <TableCol>
                  <ActionButton
                    item={item}
                    action={"assume"}
                    handdler={toAssume}
                    type={"btn-success"}
                  ></ActionButton>
                </TableCol>
              )}
            </TableRow>
          );
        })}
      </Table>

      {/* MODAL REGION */}
      <Dialog
        open={excludeModalOpen}
        onClose={setExcludeModalOpen}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-2xl data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-left sm:mt-0 w-full">
                    <DialogTitle
                      as="h3"
                      className="text-lg font-semibold text-gray-900"
                    >
                      Deletar Demanda
                    </DialogTitle>
                    <p className="text-red-500 font-bold mt-2">
                      Tem certeza que deseja excluir esse item? Os dados
                      excluidos não poderão ser recuperados.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() => {
                    removeItem(excludeModal || null);
                  }}
                  className="btn-danger"
                >
                  Excluir
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={() => {
                    setExcludeModalOpen(false);
                  }}
                  className="btn-cancel mr-3"
                >
                  Cancelar
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={assumeModalOpen}
        onClose={setAssumeModalOpen}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-2xl data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-left sm:mt-0 w-full">
                    <DialogTitle
                      as="h3"
                      className="text-lg font-semibold text-gray-900"
                    >
                      Assumir Demanda
                    </DialogTitle>
                    <p className="font-bold mt-2">
                      Tem certeza que deseja assumir essa demanda? O status será
                      alterado para &quot;Em atendimento&quot; e ficará sob sua
                      responsabilidade.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() => {
                    assumeItem(assumeModal || null);
                  }}
                  className="btn-success"
                >
                  Assumir demanda
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={() => {
                    setAssumeModalOpen(false);
                  }}
                  className="btn-cancel mr-3"
                >
                  Cancelar
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default AllDemandas;
