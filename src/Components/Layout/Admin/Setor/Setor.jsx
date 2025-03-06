import { useEffect, useState } from "react";

import API from "../../../../../service/API";

import Table from "../../../shared/Table/Table";
import TableRow from "../../../shared/Table/TableRow";
import TableCol from "../../../shared/Table/TableCol";
import ActionButton from "../../../shared/Table/ActionButton";
import AlertInfo from "../../../shared/alert/AlertInfo";
import HanlerError from "../../../middleware/HandleError";
import Loading from "../../../shared/Loading";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FaTrash, FaEdit } from "react-icons/fa";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

const Setor = () => {
  let [tableData, setTableData] = useState([]);

  let [openModalEdit, setOpenModalEdit] = useState(false);
  let [modalData, setModalData] = useState([]);

  let [excludeModalOpen, setExcludeModalOpen] = useState(false);
  let [excludeModal, setExcludeModal] = useState([]);

  let [alertBS, setAlertBS] = useState(null);
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await API.get("/setor");
      setTableData(response.data.setores);
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

  const toSave = (item) => {
    setModalData(item);
    setOpenModalEdit(true);
  };

  const saveItem = async (id) => {
    if (!id) {
      try {
        const response = await API.post(`/setor`, { setor: modalData });
        setAlertBS([`Salvo com sucesso ${response.status}`, "success"]);
      } catch (error) {
        setAlertBS([
          `${error.response.data.message} ${error.status}`,
          "danger",
        ]);
      } finally {
        loadTable();
      }
      return;
    }

    try {
      const response = await API.put(`/setor/${id}`, { setor: modalData });
      setAlertBS([`Salvo com sucesso ${response.status}`, "success"]);
    } catch (error) {
      setAlertBS([`${error.response.data.message} ${error.status}`, "danger"]);
    } finally {
      loadTable();
    }
  };

  const toRemove = (item) => {
    setExcludeModal(item.id);
    setExcludeModalOpen(true);
  };

  const removeItem = async (id) => {
    setLoading(true);
    try {
      console.log(id);
      const response = await API.delete(`/setor/${id}`);
      setAlertBS([`Excluido com sucesso ${response.status}`, "success"]);
    } catch (error) {
      setAlertBS([error.message, "danger"]);
    } finally {
      loadTable();
      setLoading(false);
      setExcludeModalOpen(false);
    }
  };

  const clearModal = () => {
    setModalData([]);
  };

  const editableItem = (key, value) => {
    setModalData((e) => ({ ...e, [key]: value }));
    console.log(modalData);
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
    <>
      <div id="PainelAdmin">
        {/* Alerta */}
        {alertBS && (
          <AlertInfo
            tipo={alertBS[1]}
            menssagem={alertBS[0]}
            setAlert={setAlertBS}
          />
        )}
        <div>
          <Button
            label="Cadastrar Setor"
            className="btn-primary"
            onClick={() => {
              setOpenModalEdit(true);
              clearModal();
            }}
          />

          <DataTable
            value={tableData}
            size="large"
            rowHover
            stripedRows
            tableClassName="mt-4"
            paginator
            rows={10}
            rowsPerPageOptions={[10, 25, 50]}
            tableStyle={{ minWidth: '40rem' }}
          >
            <Column field="id" header="#"></Column>
            <Column field="name" header="Nome"></Column>
            <Column field="description" header="Descrição"></Column>
            <Column
              header="Editar"
              body={(rowData) => (
                <Button
                  className="btn-primary"
                  label={<FaEdit />}
                  onClick={() => toSave(rowData)}
                />
              )}
            ></Column>
            <Column
              header="Excluir"
              body={(rowData) => (
                <Button
                  className="btn-danger"
                  label={<FaTrash />}
                  onClick={() => toRemove(rowData)}
                />
              )}
            ></Column>
          </DataTable>
        </div>
      </div>

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
                      {modalData.id ? "Atualizar Setor" : "Cadastrar Setor"}
                    </DialogTitle>
                    <div className="mt-2">
                      <div id="UserConfig">
                        <div id="Data" className="sm:grid grid-cols-1 gap-4">
                          <fieldset className="mt-2">
                            <label htmlFor="Name" className="font-bold">
                              Nome do Setor
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
                              Descrição do Setor
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
                    clearModal();
                    loadTable();
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
              <div className="bg-gray-50 px-4 py-3 flex sm:flex-row-reverse sm:px-6">
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
    </>
  );
};

export default Setor;
