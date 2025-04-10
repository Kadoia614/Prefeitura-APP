import { useEffect, useState, useRef } from "react";
import API from "../../../../../service/API";
import HandleError from "../../../middleware/HandleError";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FaTrash, FaEdit } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { Checkbox } from "primereact/checkbox";
import InputField from "../../../shared/InputField";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

import { Toast } from "primereact/toast";

const PainelServices = () => {
  const [tableData, setTableData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [modalData, setModalData] = useState({});
  const [excludeModalOpen, setExcludeModalOpen] = useState(false);
  const [excludeModal, setExcludeModal] = useState(null);
  const [rolePermission, setRolePermission] = useState(false);
  const [error, setError] = useState(null);
  const toast = useRef(null); // Create a ref for the toast

  const fetchData = async () => {
    try {
      const response = await API.get("/service");
      setTableData(response.data.services);
      setRoles(response.data.roles);
    } catch (error) {
      setError(error.status);
      showToast("error", "Failed to load services: " + error.message); // Show toast on error
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
    try {
      if (!id) {
        await API.post("/service", { service: modalData });
      } else {
        await API.put(`/service/${id}`, { service: modalData });
      }
      loadTable();
      clearModal();
      showToast("success", "Service saved successfully!"); // Show success toast
      setOpenModalEdit(false);
    } catch (error) {
      console.error("Error saving item:", error);
      showToast("error", "Failed to save service: " + error.message); // Show toast on error
    }
  };

  const editableItem = (key, value) => {
    setModalData((prev) => ({ ...prev, [key]: value }));
  };

  const editablePermission = (permissionId, key, value) => {
    setModalData((prev) => ({
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
      await API.delete(`/service/${id}`);
      loadTable();
      showToast("success", "Service deleted successfully!"); // Show success toast
    } catch (error) {
      console.error("Error deleting item:", error);
      showToast("error", "Failed to delete service: " + error.message); // Show toast on error
    } finally {
      setExcludeModalOpen(false);
    }
  };
  //#endregion REMOVE ITEMS

  const clearModal = () => {
    setModalData({});
  };

  const showToast = (severity, detail) => {
    toast.current.show({
      severity,
      summary: severity.charAt(0).toUpperCase() + severity.slice(1),
      detail,
      life: 3000,
    });
  };

  useEffect(() => {
    loadTable();
  }, []);

  if (error) {
    return <HandleError Error={error} />;
  }

  return (
    <div id="PainelServices" className="p-4 bg-gray-50">
      <Toast ref={toast} /> {/* Add Toast component here */}
      <Button
        label="Cadastrar Serviço"
        className="btn-primary mb-4"
        onClick={() => {
          clearModal();
          setOpenModalEdit(true);
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
        <Column field="id" header="#" />
        <Column field="name" header="Nome" />
        <Column field="description" header="Descrição" />
        <Column field="url" header="Url" />
        <Column
          header="Editar"
          body={(rowData) => (
            <Button
              className="btn-primary"
              label={<FaEdit />}
              onClick={() => toSave(rowData)}
            />
          )}
        />
        <Column
          header="Excluir"
          body={(rowData) => (
            <Button
              className="btn-danger"
              label={<FaTrash />}
              onClick={() => toRemove(rowData)}
            />
          )}
        />
      </DataTable>
      {/* MODAL REGION */}
      <Dialog
        open={openModalEdit}
        onClose={() => setOpenModalEdit(false)}
        className="relative z-10"
      >
        <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-left sm:mt-0 w-full">
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
                          <InputField
                            id="Name"
                            label="Nome do Serviço"
                            value={modalData.name || ""}
                            onChange={(e) =>
                              editableItem("name", e.target.value)
                            }
                          />
                          {/* Description */}
                          <InputField
                            id="Description"
                            label="Descrição do Serviço"
                            value={modalData.description || ""}
                            onChange={(e) =>
                              editableItem("description", e.target.value)
                            }
                            isTextArea
                          />
                          {/* URL */}
                          <InputField
                            id="Url"
                            label="Url do Serviço"
                            value={modalData.url || ""}
                            onChange={(e) =>
                              editableItem("url", e.target.value)
                            }
                          />
                        </div>

                        {/* Roles config permissions */}
                        <div
                          id="RolesConfig"
                          className={`mt-6 bg-gray-100 rounded-sm ring-gray-300 ring-1 hover:ring-primary transition ${
                            rolePermission ? "h-full" : "h-15"
                          } overflow-hidden`}
                        >
                          <div
                            className="flex justify-between items-center px-4 py-4 cursor-pointer"
                            onClick={() => setRolePermission(!rolePermission)}
                          >
                            <h3 className="text-lg font-bold">
                              Serviços Ativos
                            </h3>
                            <IoIosArrowDown
                              className={`transition ${
                                rolePermission ? "rotate-180" : "rotate-0"
                              }`}
                            />
                          </div>

                          <div>
                            {modalData?.permission
                              ? modalData.permission.map((permission) => (
                                  <div
                                    key={permission.id}
                                    className="flex justify-between items-start px-4 py-2"
                                  >
                                    <h3 className="text-lg font-bold">
                                      {
                                        roles.find(
                                          (role) =>
                                            role.id === permission.role_id
                                        )?.name
                                      }
                                    </h3>
                                    <div className="flex space-x-4">
                                      <Checkbox
                                        inputId={`read-${permission.role_id}`}
                                        name="read"
                                        value="Read"
                                        onChange={(e) =>
                                          editablePermission(
                                            permission.id,
                                            "read",
                                            e.checked
                                          )
                                        }
                                        checked={permission.read || false}
                                      />
                                      <label
                                        htmlFor={`read-${permission.role_id}`}
                                      >
                                        Read
                                      </label>

                                      <Checkbox
                                        inputId={`write-${permission.role_id}`}
                                        name="write"
                                        value="Write"
                                        onChange={(e) =>
                                          editablePermission(
                                            permission.id,
                                            "write",
                                            e.checked
                                          )
                                        }
                                        checked={permission.write || false}
                                      />
                                      <label
                                        htmlFor={`write-${permission.role_id}`}
                                      >
                                        Write
                                      </label>

                                      <Checkbox
                                        inputId={`edit-${permission.role_id}`}
                                        name="edit"
                                        value="Edit"
                                        onChange={(e) =>
                                          editablePermission(
                                            permission.id,
                                            "edit",
                                            e.checked
                                          )
                                        }
                                        checked={permission.edit || false}
                                      />
                                      <label
                                        htmlFor={`edit-${permission.role_id}`}
                                      >
                                        Edit
                                      </label>

                                      <Checkbox
                                        inputId={`delete-${permission.role_id}`}
                                        name="delete"
                                        value="Delete"
                                        onChange={(e) =>
                                          editablePermission(
                                            permission.id,
                                            "del",
                                            e.checked
                                          )
                                        }
                                        checked={permission.del || false}
                                      />
                                      <label
                                        htmlFor={`delete-${permission.role_id}`}
                                      >
                                        Delete
                                      </label>
                                    </div>
                                  </div>
                                ))
                              : ""}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <Button
                  label="Salvar"
                  onClick={() => saveItem(modalData.id || null)}
                  className="btn-primary"
                />
                <Button
                  label="Cancelar"
                  onClick={() => {
                    setOpenModalEdit(false);
                    clearModal();
                  }}
                  className="btn-cancel mr-3"
                />
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      
      {/* Exclude Confirmation Dialog */}
      <Dialog
        open={excludeModalOpen}
        onClose={() => setExcludeModalOpen(false)}
        className="relative z-10"
      >
        <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-left sm:mt-0 w-full">
                    <DialogTitle
                      as="h3"
                      className="text-lg font-semibold text-gray-900"
                    >
                      Deletar Serviço
                    </DialogTitle>
                    <p className="text-red-500 font-bold mt-2">
                      Tem certeza que deseja excluir esse item? Os dados
                      excluídos não poderão ser recuperados.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <Button
                  label="Excluir"
                  onClick={() => removeItem(excludeModal)}
                  className="btn-danger"
                />
                <Button
                  label="Cancelar"
                  onClick={() => setExcludeModalOpen(false)}
                  className="btn-cancel mr-3"
                />
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default PainelServices;
