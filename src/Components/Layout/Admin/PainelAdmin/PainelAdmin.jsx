import { useEffect, useState, useRef } from "react";
import HandleError from "../../../middleware/HandleError";
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

import API from "../../../../../service/API";
import { Toast } from "primereact/toast";
import SelectField from "../../../shared/SelectField";
import InputField from "../../../shared/InputField";

const API_ENDPOINTS = {
  USERS: "/user",
};

const MESSAGES = {
  SUCCESS: {
    DELETE: "Deleted successfully",
    SAVE: "Saved successfully",
  },
  ERROR: {
    REQUIRED_FIELDS: "Name and Email are required.",
    OPERATION_CANCELLED: (msg) => `Operation cancelled: ${msg}`,
  },
};

const PainelAdmin = () => {
  const [tableData, setTableData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [setores, setSetores] = useState([]);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [modalData, setModalData] = useState({});
  const [excludeModalOpen, setExcludeModalOpen] = useState(false);
  const [excludeModal, setExcludeModal] = useState(null);
  const [error, setError] = useState(null);
  const toast = useRef(null);

  const fetchData = async () => {
    try {
      const response = await API.get(API_ENDPOINTS.USERS);
      console.log(response.data)
      setTableData(response.data.users);
      setRoles(response.data.roles);
      setSetores(response.data.setores);
    } catch (error) {
      setError(error.status);
    }
  };

  const confirmDeletion = (item) => {
    setExcludeModal(item.id);
    setExcludeModalOpen(true);
  };

  const removeItem = async () => {
    try {
      await API.delete(`${API_ENDPOINTS.USERS}/${excludeModal}`);
      showToast("success", MESSAGES.SUCCESS.DELETE);
      setExcludeModalOpen(false);
    } catch (error) {
      showToast(
        "error",
        MESSAGES.ERROR.OPERATION_CANCELLED(error.response.data.message)
      );
    } finally {
      setExcludeModal(null);
      fetchData();
    }
  };

  const saveItem = async (id) => {
    if (!modalData.name || !modalData.email) {
      showToast("error", MESSAGES.ERROR.REQUIRED_FIELDS);
      return;
    }

    const method = id ? API.put : API.post;
    const url = id ? `${API_ENDPOINTS.USERS}/${id}` : API_ENDPOINTS.USERS;

    try {
      await method(url, { user: modalData });
      showToast("success", MESSAGES.SUCCESS.SAVE);
      clearModal();
      setOpenModalEdit(false);
    } catch (error) {
      showToast(
        "error",
        MESSAGES.ERROR.OPERATION_CANCELLED(error.response.data.message)
      );
    } finally {
      fetchData();
    }
  };

  const showToast = (severity, detail) => {
    toast.current.show({
      severity,
      summary: severity.charAt(0).toUpperCase() + severity.slice(1),
      detail,
      life: 3000,
    });
  };

  const clearModal = () => {
    setModalData({});
  };

  useEffect(() => {
    fetchData();
  }, []);

  const roleTableTemplate = (row) =>
    roles.find((role) => role.id === row.role_id)?.name || "";
  const setorTableTemplate = (row) =>
    setores.find((setor) => setor.id === row.setor_id)?.name || "";

  if (error) {
    return <HandleError Error={error} />;
  }

  return (
    <div id="PainelAdmin" className="p-4 bg-gray-50">
      <Toast ref={toast}/>

      <Button
        label="Cadastrar usuário"
        className="btn-primary mb-4"
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
        <Column field="name" header="Name" />
        <Column field="email" header="Email" />
        <Column field="ramal" header="Ramal" />
        <Column field="setor_id" header="Setor" body={setorTableTemplate} />
        <Column field="role_id" header="Permissão" body={roleTableTemplate} />
        <Column
          header="Editar"
          body={(rowData) => (
            <Button
              className="btn-primary"
              label={<FaEdit />}
              onClick={() => {
                setModalData(rowData);
                setOpenModalEdit(true);
              }}
            />
          )}
        />
        <Column
          header="Excluir"
          body={(rowData) => (
            <Button
              className="btn-danger"
              label={<FaTrash />}
              onClick={() => confirmDeletion(rowData)}
            />
          )}
        />
      </DataTable>

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
                  onClick={() => removeItem()}
                  className="btn-danger"
                />
                <Button
                  label="Cancelar"
                  onClick={() => {
                    setExcludeModalOpen(false);
                    showToast("warn", "Operation cancelled");
                  }}
                  className="btn-cancel mr-3"
                />
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      <Dialog
        header={modalData.id ? "Atualizar Usuário" : "Cadastrar usuário"}
        open={openModalEdit}
        onClose={() => setOpenModalEdit(false)}
        className="relative z-10"
      >
        <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
              <div className="p-4">
                <div id="UserConfig">
                  <div className="sm:grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                      id="Name"
                      label="Nome"
                      value={modalData.name || ""}
                      onChange={(e) =>
                        setModalData({ ...modalData, name: e.target.value })
                      }
                    />
                    <InputField
                      id="Email"
                      label="Email"
                      value={modalData.email || ""}
                      onChange={(e) =>
                        setModalData({ ...modalData, email: e.target.value })
                      }
                    />
                    <InputField
                      id="Ramal"
                      label="Ramal"
                      value={modalData.ramal || ""}
                      onChange={(e) =>
                        setModalData({ ...modalData, ramal: e.target.value })
                      }
                      maxLength="4"
                    />
                    <SelectField
                      id="Setor"
                      label="Setor"
                      value={modalData.setor_id || ""}
                      options={setores}
                      onChange={(e) =>
                        setModalData({ ...modalData, setor_id: e.target.value })
                      }
                    />
                    <SelectField
                      id="Role"
                      label="Permissão"
                      value={modalData.role_id || ""}
                      options={roles}
                      onChange={(e) =>
                        setModalData({ ...modalData, role_id: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end items-center mt-4">
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
                    className="btn-danger ml-3"
                  />
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default PainelAdmin;
