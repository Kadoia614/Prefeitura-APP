import { useEffect, useState } from "react";
import API from "../../../../../service/API";
import AlertInfo from "../../../shared/alert/AlertInfo";
import HanlerError from "../../../middleware/HandleError";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FaTrash, FaEdit } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { Checkbox } from "primereact/checkbox";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

const PainelServices = () => {
  let [tableData, setTableData] = useState([]);
  let [roles, setRoles] = useState([]);

  let [openModalEdit, setOpenModalEdit] = useState(false);
  let [modalData, setModalData] = useState({});

  let [excludeModalOpen, setExcludeModalOpen] = useState(false);
  let [excludeModal, setExcludeModal] = useState(false);

  let [rolePermission, setRolePermission] = useState(false);

  let [alertBS, setAlertBS] = useState(null);
  let [error, setError] = useState(false);

  const fetchData = async () => {
    try {
      const response = await API.get("/service");
      let services = response.data.services;
      let roles = response.data.roles;
      setTableData(services);
      setRoles(roles);
    } catch (error) {
      setError(error.status);
    }
  };

  const loadTable = () => {
    fetchData();
  };

  //#region EDIT / CREATE ITEMS
  const toSave = (item) => {
    setModalData(item);
    setOpenModalEdit(true);
  };

  const saveItem = async (id) => {
    if (!id) {
      try {
        const response = await API.post("/service", { service: modalData });
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
      const response = await API.put(`/service/${id}`, { service: modalData });
      setAlertBS([`Salvo com sucesso ${response.status}`, "success"]);
    } catch (error) {
      setAlertBS([`${error.response.data.message} ${error.status}`, "danger"]);
    } finally {
      loadTable();
    }
  };

  const editableItem = (key, value) => {
    setModalData((e) => ({ ...e, [key]: value }));
  };

  const editablePermission = async (permissionId, key, value) => {
    console.log(permissionId, key, value);
    await setModalData((prev) => ({
      ...prev,
      permission: prev.permission.map((perm) =>
        perm.id === permissionId ? { ...perm, [key]: value } : perm
      ),
    }));
  };

  //#endregion EDIT ITEMS

  //#region REMOVE ITEMS

  const toRemove = (item) => {
    setExcludeModal(item.id);
    setExcludeModalOpen(true);
  };

  const removeItem = async (id) => {
    try {
      const response = await API.delete(`/service/${id}`);
      setAlertBS([`Excluido com sucesso ${response.status}`, "success"]);
    } catch (error) {
      setAlertBS([error.message, "danger"]);
    } finally {
      setExcludeModalOpen(false);
      loadTable();
    }
  };
  //#endregion REMOVE ITEMS

  const clearModal = () => {
    setModalData([]);
  };

  useEffect(() => {
    loadTable();
  }, []);

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
        <Button
          label="Cadastrar Serviço"
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
          tableStyle={{ minWidth: "40rem" }}
        >
          <Column field="id" header="#"></Column>
          <Column field="name" header="Nome"></Column>
          <Column field="description" header="Descrição"></Column>
          <Column field="url" header="Url"></Column>
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
                          {/* Name */}
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

                          {/* Description */}
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
                          {/* URL */}
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

                        {/* Roles config permissions */}
                        <div
                          id="RolesConfig"
                          className={`mt-6 bg-gray-100 rounded-sm ring-gray-300 ring-1 hover:ring-primary transition ${
                            rolePermission ? "h-full" : "h-15"
                          } overflow-hidden`}
                        >
                          <div
                            className="flex justify-between items-center px-4 py-4"
                            onClick={() => setRolePermission(!rolePermission)}
                          >
                            <h3 className="text-lg font-bold">
                              Serviços Ativos
                            </h3>
                            <IoIosArrowDown
                              className={`${
                                rolePermission ? "rotate-180" : "rotate-0"
                              } transition`}
                            />
                          </div>

                          <div>
                            {modalData?.permission
                              ? modalData.permission.map((permission) => {
                                  return (
                                    <div
                                      key={permission.id}
                                      className="flex justify-between items-start px-4 py-8 flex-col gap-4"
                                    >
                                      <h3 className="text-lg font-bold">
                                        {
                                          roles.find(
                                            (roles) =>
                                              roles.id === permission.role_id
                                          ).name
                                        }
                                      </h3>
                                      <div className="flex flex-row justify-around w-full">
                                      <div className="flex align-items-center">
                                          <Checkbox
                                            inputId={`read-${permission.role_id}`}
                                            name="read"
                                            value="Read"
                                            onChange={(e) => {
                                              editablePermission(
                                                permission.id,
                                                "read",
                                                e.target.checked ? true : false
                                              );
                                            }}
                                            checked={permission.read || false}
                                          />
                                          <label
                                            htmlFor={`read-${permission.role_id}`}
                                            className="ml-2"
                                          >
                                            Read
                                          </label>
                                        </div>
                                        
                                        <div className="flex align-items-center">
                                          <Checkbox
                                            inputId={`write-${permission.role_id}`}
                                            name="write"
                                            value="Write"
                                            onChange={(e) => {
                                              editablePermission(
                                                permission.id,
                                                "write",
                                                e.target.checked ? true : false
                                              );
                                            }}
                                            checked={permission.write || false}
                                          />
                                          <label
                                            htmlFor={`write-${permission.role_id}`}
                                            className="ml-2"
                                          >
                                            Write
                                          </label>
                                        </div>

                                        <div className="flex align-items-center">
                                          <Checkbox
                                            inputId={`edit-${permission.role_id}`}
                                            name="edit"
                                            value="Edit"
                                            onChange={(e) => {
                                              editablePermission(
                                                permission.id,
                                                "edit",
                                                e.target.checked ? true : false
                                              );
                                            }}
                                            checked={permission.edit || false}
                                          />
                                          <label
                                            htmlFor={`edit-${permission.role_id}`}
                                            className="ml-2"
                                          >
                                            Edit
                                          </label>
                                        </div>


                                        <div className="flex align-items-center">
                                          <Checkbox
                                            inputId={`delete-${permission.role_id}`}
                                            name="delete"
                                            value="del"
                                            onChange={(e) => {
                                              editablePermission(
                                                permission.id,
                                                "del",
                                                e.target.checked ? true : false
                                              );
                                            }}
                                            checked={permission.del || false}
                                          />
                                          <label
                                            htmlFor={`delete-${permission.role_id}`}
                                            className="ml-2"
                                          >
                                            Delete
                                          </label>
                                        </div>
                                        
                                      </div>
                                    </div>
                                  );
                                })
                              : ""}
                          </div>
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
