import { useEffect, useState } from "react";
import API from "../../../../../service/API";
import Table from "../../../shared/Table/Table";
import TableRow from "../../../shared/Table/TableRow";
import TableCol from "../../../shared/Table/TableCol";
import AlertInfo from "../../../shared/alert/AlertInfo";
import HanlerError from "../../../middleware/HandleError";
import Loading from "../../../shared/Loading";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import ActionButton from "../../../shared/Table/ActionButton";

const PainelServices = () => {
  let [tableData, setTableData] = useState([]);

  let [openModalEdit, setOpenModalEdit] = useState(false);
  let [modalData, setModalData] = useState({});

  let [excludeModalOpen, setExcludeModalOpen] = useState(false);
  let [excludeModal, setExcludeModal] = useState(false);

  let [alertBS, setAlertBS] = useState(null);
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await API.get("/allservices");
      console.log(response.data)
      setTableData(response.data.services);
      setLoading(false);
    } catch (error) {
      setError(error.status);
    } finally {
      setLoading(false);
    }
  };

  const loadTable = () => {
    fetchData();
  };

  //#region EDIT / CREATE ITEMS
  const toSave = (item) => {
    setModalData(item);
    console.log(item);
    setOpenModalEdit(true);
  };

  const saveItem = async (id) => {
    if (!id) {
      try {
        const response = await API.post("/services", { service: modalData });
        setAlertBS([`Salvo com sucesso ${response.status}`, "success"]);
      } catch (error) {
        setAlertBS([
          `${error.response.data.message} ${error.status}`,
          "danger",
        ]);
      } finally {
        clearModal();
        loadTable();
      }
      return;
    }

    try {
      const response = await API.put(`/services/${id}`, { service: modalData });
      setAlertBS([`Salvo com sucesso ${response.status}`, "success"]);
    } catch (error) {
      setAlertBS([`${error.response.data.message} ${error.status}`, "danger"]);
    } finally {
      loadTable();
    }
  };

  const editableItem = (key, value) => {
    setModalData((e) => ({ ...e, [key]: value }));
    console.log(modalData);
  };

  //#endregion EDIT ITEMS

  //#region REMOVE ITEMS

  const toRemove = (item) => {
    setExcludeModal(item.id);
    setExcludeModalOpen(true);
  };

  const removeItem = async (id) => {
    setLoading(true);
    try {
      const response = await API.delete(`/services/${id}`);
      setAlertBS([`Excluido com sucesso ${response.status}`, "success"]);
    } catch (error) {
      setAlertBS([error.message, "danger"]);
    } finally {
      setExcludeModalOpen(false);
      loadTable();
      setLoading(false);
    }
  };
  //#endregion REMOVE ITEMS

  const clearModal = () => {
    setModalData([]);
  };

  useEffect(() => {
    loadTable();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <HanlerError Error={error} />;
  }

  return (
    <div id="PainelServices">
      {/* Alerta */}
      {alertBS && (
        <AlertInfo
          tipo={alertBS[1]}
          menssagem={alertBS[0]}
          setAlert={setAlertBS}
        />
      )}
      <div>
        <button
          className="btn-primary"
          onClick={() => {
            setOpenModalEdit(true);
            clearModal();
          }}
        >
          Cadastrar Serviço
        </button>
        <Table header={["#", "Nome", "Descrição", "Url", "Editar", "Excluir"]}>
          {tableData.map((item) => {
            return (
              <TableRow key={item.id}>
                <TableCol>{item.id}</TableCol>
                <TableCol>{item.name}</TableCol>
                <TableCol>{item.description}</TableCol>
                <TableCol>{item.url}</TableCol>
                <TableCol>
                  <ActionButton
                    type="btn-primary"
                    action="edit"
                    handdler={toSave}
                    item={item}
                  />
                </TableCol>
                <TableCol>
                  <ActionButton
                    type="btn-danger"
                    action="delete"
                    handdler={toRemove}
                    item={item}
                  />
                </TableCol>
              </TableRow>
            );
          })}
        </Table>
      </div>

      {/* MODAL REGION */}
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
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <DialogTitle
                      as="h3"
                      className="text-lg font-semibold text-gray-900"
                    >
                      {modalData.id ? "Atualizar Serviço" : "Cadastrar Serviço"}
                    </DialogTitle>
                    <div className="mt-2">
                      <div id="ServiceConfig">
                        <div id="Data" className="sm:grid grid-cols-1 gap-4">
                          <fieldset className="mt-2">
                            <label htmlFor="Name" className="font-bold">
                              Nome do Serviço
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                id="Name"
                                className="rounded-sm ring-primary ring-1 px-2 py-1"
                                placeholder="Nome"
                                value={modalData.name || ""}
                                onChange={(e) => {
                                  editableItem("name", e.target.value);
                                }}
                                required
                              />
                            </div>
                          </fieldset>
                          <fieldset className="mt-2">
                            <label htmlFor="Description" className="font-bold">
                              Descrição do Serviço
                            </label>
                            <div className="mt-1">
                              <textarea
                                id="Description"
                                className="rounded-sm ring-primary ring-1 px-2 py-1 w-full"
                                placeholder="Descrição"
                                value={modalData.description || ""}
                                onChange={(e) => {
                                  editableItem("description", e.target.value);
                                }}
                              />
                            </div>
                          </fieldset>

                          <fieldset className="mt-2">
                            <label htmlFor="Url" className="font-bold">
                              Url do Serviço
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                id="Url"
                                className="rounded-sm ring-primary ring-1 px-2 py-1 w-full"
                                placeholder="Url"
                                value={modalData.url || ""}
                                onChange={(e) => {
                                  editableItem("url", e.target.value);
                                }}
                              />
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
                  onClick={async () => {
                    setOpenModalEdit(false);
                    await saveItem(modalData.id || null);
                  }}
                  className="btn-primary"
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
                      Deletar Usuário
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
    </div>
  );
};

export default PainelServices;
