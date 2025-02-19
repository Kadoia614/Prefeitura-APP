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

const UserDemandas = () => {
  let { scopo, setScopo } = useContext(AppContext);
  let [tableData, setTableData] = useState([]);
  let [loading, setLoading] = useState(true);

  let [alertPostit, setAlertPostit] = useState(null);

  let [error, setError] = useState(false);

  let [modalData, setModalData] = useState([]);

  let [modalItemToFinalize, setModalItemToFinalize] = useState(false);
  let [itemToFinalize, setItemToFinalize] = useState([]);
  let [openModalEdit, setOpenModalEdit] = useState(false);

  const fetchData = async () => {
    try {
      let response = await API.get("/demandas/user");
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

  //#region EDIT / CREATE ITEMS

  const toSave = (item) => {
    setModalData(item);
    setOpenModalEdit(true);
  };

  const saveItem = async (id) => {
    try {
      if (id) {
        let response = await API.put(`/demandas/user/${id}`, {
          description: modalData.description,
          patrimonio: modalData.patrimonio,
          prioridade: modalData.prioridade,
          status: modalData.status,
        });
        setAlertPostit([
          `${response.message || "Salvo com sucesso!"}`,
          "success",
        ]);
        setOpenModalEdit(false);
        return;
      }

      let response = await API.post("/demandas", {
        description: modalData.description,
        patrimonio: modalData.patrimonio,
        prioridade: modalData.prioridade,
      });
      setAlertPostit([
        `${response.message || "Salvo com sucesso!"}`,
        "success",
      ]);
      setOpenModalEdit(false);

      return;
    } catch (error) {
      setAlertPostit([
        `${error.message || "Ops, tivemos um problema"}`,
        "danger",
      ]);
    } finally {
      loadTable();
    }
  };

  const toFinalize = (item) => {
    setItemToFinalize(item.id);
    setModalItemToFinalize(true);
  };

  const finalizeItem = async (id) => {
    try {
      const response = await API.put(`/demandas/finalizar/${id}`);
      setAlertPostit([
        `${response.message || "Salvo com sucesso!"}`,
        "success",
      ]);
      setModalItemToFinalize(false);
      return;
    } catch (error) {
      setAlertPostit([
        `${error.message || "Ops, tivemos um problema"}`,
        "danger",
      ]);
    } finally {
      loadTable();
    }
  };

  const editableItem = (key, value) => {
    setModalData((e) => ({ ...e, [key]: value }));
  };

  //#endregion EDIT ITEMS

  const clearModal = () => {
    setModalData({});
  };

  useEffect(() => {
    loadTable();

    setInterval(() => {
      loadTable();
    }, 10000);
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
        <button
          className="btn-primary"
          onClick={() => {
            setOpenModalEdit(true);
            clearModal();
          }}
          disabled={scopo === "tecnico" ? true : false}
        >
          Cadastrar demanda
        </button>
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
          "Editar",
          scopo === "tecnico" ? "Finalizar" : "",
        ]}
      >
        {tableData?.map((item) => {
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
              <TableCol>
                <ActionButton
                  item={item}
                  action={"edit"}
                  handdler={toSave}
                  type={"btn-primary"}
                ></ActionButton>
              </TableCol>
              {scopo === "tecnico" ? (
                <TableCol>
                  <ActionButton
                    item={item}
                    action={"confirm"}
                    handdler={toFinalize}
                    type={"btn-success"}
                  ></ActionButton>
                </TableCol>
              ) : (
                ""
              )}
            </TableRow>
          );
        })}
      </Table>

      <Dialog
        open={openModalEdit}
        onClose={setOpenModalEdit}
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
                      {modalData.id ? "Atualizar Demanda" : "Cadastrar Demanda"}
                    </DialogTitle>
                    {/* Alerta */}
                    {alertPostit && (
                      <AlertInfo
                        setAlert={setAlertPostit}
                        tipo={alertPostit[1]}
                        menssagem={alertPostit[0]}
                      />
                    )}
                    <div className="mt-2">
                      <div id="UserConfig">
                        <div
                          id="Data"
                          className="sm:grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                          <fieldset className="mt-2">
                            <label htmlFor="Patrimonio" className="font-bold">
                              Patrimônio
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                id="Patrimonio"
                                className="input"
                                placeholder="Patrimônio do equipamento"
                                value={modalData.patrimonio || ""}
                                onChange={(e) => {
                                  editableItem("patrimonio", e.target.value);
                                }}
                                required
                                disabled={
                                  modalData.id && scopo != "admin"
                                    ? "disabled"
                                    : false
                                }
                              />
                            </div>
                          </fieldset>
                          <fieldset className="mt-2 col-span-2">
                            <label htmlFor="Descricao" className="font-bold">
                              Descrição
                            </label>
                            <div className="mt-1">
                              <textarea
                                id="Descricao"
                                className="input"
                                placeholder="Descrição do chamado"
                                value={modalData.description || ""}
                                onChange={(e) => {
                                  editableItem("description", e.target.value);
                                }}
                                disabled={
                                  modalData.id &&
                                  scopo != "user" &&
                                  scopo != "gestor" &&
                                  scopo != "admin"
                                    ? "disabled"
                                    : false
                                }
                              />
                            </div>
                          </fieldset>
                          <fieldset className="mt-2">
                            <label htmlFor="Prioridade" className="font-bold">
                              Prioridade
                            </label>
                            <div className="mt-1">
                              <select
                                className="select"
                                name="Prioridade"
                                id="Prioridade"
                                value={modalData.prioridade + 1 || ""}
                                onChange={(e) => {
                                  editableItem(
                                    "prioridade",
                                    e.target.value - 1
                                  );
                                }}
                                disabled={
                                  modalData.id &&
                                  scopo != "admin" &&
                                  scopo != "tecnico"
                                    ? "disabled"
                                    : false
                                }
                              >
                                <option value="" disabled>
                                  Selecione a prioridade
                                </option>
                                <option value="1">Baixa</option>
                                <option value="2">Média</option>
                                <option value="3">Alta</option>
                                <option value="4">Gabinete</option>
                              </select>
                            </div>
                          </fieldset>
                          <fieldset className="mt-2">
                            <label htmlFor="Status" className="font-bold">
                              Status
                            </label>
                            <div className="mt-1">
                              <select
                                className="select"
                                name="Status"
                                id="Status"
                                value={modalData.status + 1 || ""}
                                onChange={(e) => {
                                  editableItem("status", e.target.value - 1);
                                }}
                                disabled={
                                  modalData.id && scopo != "admin"
                                    ? "disabled"
                                    : false
                                }
                              >
                                <option value="" disabled>
                                  Status do Chamado
                                </option>
                                <option value="1">Aberto</option>
                                <option value="2">Em atendimento</option>
                                <option value="3">Aguardando resposta</option>
                                <option value="4">Concluído</option>
                              </select>
                            </div>
                          </fieldset>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() => {
                    saveItem(modalData.id || null);
                  }}
                  className="btn-primary sm:mr-3"
                >
                  Salvar
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={() => {
                    setOpenModalEdit(false);
                    clearModal();
                  }}
                  className="btn-cancel sm:mr-3"
                >
                  Cancelar
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={modalItemToFinalize}
        onClose={setModalItemToFinalize}
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
                      Encerrar Demanda
                    </DialogTitle>
                    <p className="font-bold mt-2">
                      Tem certeza que deseja finalizar essa demanda? O status
                      será alterado para &quot;Finalizado&quot;.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() => {
                    finalizeItem(itemToFinalize || null);
                  }}
                  className="btn-success"
                >
                  Encerrar demanda
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={() => {
                    setModalItemToFinalize(false);
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

export default UserDemandas;
