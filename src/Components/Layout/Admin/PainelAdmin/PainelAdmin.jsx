import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { IoIosArrowDown } from "react-icons/io";

import { Dialog } from "primereact/dialog";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FaTrash, FaEdit } from "react-icons/fa";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";

import API from "../../../../../service/API";
import { Toast } from "primereact/toast";

const PainelAdmin = () => {
  let [tableData, setTableData] = useState([]);

  let [roles, setRoles] = useState([]);
  let [setores, setSetores] = useState([]);

  let [openModalEdit, setOpenModalEdit] = useState(false);
  let [modalData, setModalData] = useState([]);
  let [permissionOpen, setPermissionOpen] = useState(false);

  let [excludeModal, setExcludeModal] = useState();

  let [error, setError] = useState(false);

  const toast = useRef(null);

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await API.get("/user");
      setTableData(response.data.users);
      setRoles(response.data.roles);
      setSetores(response.data.setores);
    } catch (error) {
      if (error.status == 401) {
        navigate("/login");
      } else {
        setError(error.status);
      }
    }
  };

  //#region REMOVE ITEMS

  const toRemove = (item) => {
    console.log(item);
    setExcludeModal(item.id);
  };

  useEffect(() => {
    if (excludeModal !== undefined) {
      confirm();
    }
  }, [excludeModal]);

  const removeItem = async () => {
    try {
      console.log(excludeModal);
      await API.delete(`/user/${excludeModal}`);

      toast.current.show({
        severity: "success",
        summary: "Rejected",
        detail: "Excluído com sucesso",
        life: 3000,
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Rejected",
        detail: "Operação cancelada: " + error.message,
        life: 3000,
      });
    } finally {
      setExcludeModal(null); // Reset excludeModal after deletion
      fetchData();
    }
  };
  //#endregion REMOVE ITEMS

  //#region EDIT / CREATE ITEMS
  const toSave = (item) => {
    setModalData(item);
    setOpenModalEdit(true);
  };

  const saveItem = async (id) => {
    if (!modalData.name || !modalData.email) {
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Nome e Email são obrigatórios.",
        life: 3000,
      });
      return; // Prevent submission if required fields are empty
    }
    if (!id) {
      console.log(modalData.ramal);
      try {
        await API.post("/user", {
          name: modalData.name,
          email: modalData.email,
          ramal: modalData.ramal,
          setor_id: modalData.setor_id,
          role: modalData.role,
        });
        clearModal();
        setOpenModalEdit(false);
        toast.current.show({
          severity: "success",
          summary: "Confirmed",
          detail: "Salvo com sucesso",
          life: 3000,
        });
      } catch (error) {
        toast.current.show({
          severity: "error",
          summary: "Rejected",
          detail: "Operação cancelada: " + error.response.data.message,
          life: 3000,
        });
      } finally {
        fetchData();
      }
      return;
    }

    try {
      console.log(modalData);
      await API.put(`/user/${id}`, { user: modalData });
      clearModal();
      setOpenModalEdit(false);
      toast.current.show({
        severity: "success",
        summary: "Confirmed",
        detail: "Salvo com sucesso",
        life: 3000,
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Confirmed",
        detail: "Operação cancelada: " + error.response.data,
        life: 3000,
      });
    } finally {
      fetchData();
    }
    return;
  };

  const editableItem = (key, value) => {
    setModalData((e) => ({ ...e, [key]: value }));
  };

  const editablePermission = async (serviceId, key, value) => {
    await setModalData((prev) => ({
      ...prev,
      permission: prev.permission.map((perm) =>
        perm.service_id === serviceId ? { ...perm, [key]: value } : perm
      ),
    }));
  };
  //#endregion EDIT ITEMS

  const clearModal = () => {
    setModalData({});
  };

  useEffect(() => {
    fetchData();
  }, []);

  const accept = () => {
    removeItem();
  };

  const reject = () => {
    toast.current.show({
      severity: "warn",
      summary: "Rejected",
      detail: "Operação cancelada",
      life: 3000,
    });
  };

  const confirm = () => {
    confirmDialog({
      message: "Are you sure you want to proceed?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      acceptClassName: "btn-danger",
      rejectClassName: "btn-primary",
      accept,
      reject,
    });
  };

  return (
    <>
      <div id="PainelAdmin">
        <div>
          <Button
            label="Cadastrar usuário"
            className="btn-primary"
            onClick={() => {
              setOpenModalEdit((prev) => !prev); // Ensure correct state update
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
            <Column field="id" header="Code"></Column>
            <Column field="name" header="Name"></Column>
            <Column field="email" header="Email"></Column>
            <Column field="ramal" header="Ramal"></Column>
            <Column field="setor.name" header="Setor"></Column>
            <Column field="role" header="Permissão"></Column>
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

          {/* MODAL REGION */}
          <Dialog
            header={modalData.id ? "Atualizar Usuário" : "Cadastrar usuário"}
            visible={openModalEdit}
            onHide={() => {
              if (!openModalEdit) return;
              setOpenModalEdit(false);
            }}
            className="p-4 bg-white md:w-4xl max-w-dvw"
          >
            <div className="p-4">
              <div id="UserConfig">
                <div
                  id="Data"
                  className="sm:grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <fieldset className="mt-2">
                    <label htmlFor="Name" className="font-bold">
                      Nome
                    </label>
                    <div className="mt-1">
                      <InputText
                        id="Name"
                        className="rounded-sm ring-primary ring-1 px-2 py-1 w-full"
                        placeholder="Nome do Usuário"
                        value={modalData.name || ""}
                        onChange={(e) => {
                          editableItem("name", e.target.value);
                        }}
                        required
                      />
                    </div>
                  </fieldset>
                  <fieldset className="mt-2">
                    <label htmlFor="Email" className="font-bold">
                      Email
                    </label>
                    <div className="mt-1">
                      <InputText
                        id="Email"
                        className="rounded-sm ring-primary ring-1 px-2 py-1 w-full"
                        placeholder="Email do Usuário"
                        value={modalData.email || ""}
                        onChange={(e) => {
                          editableItem("email", e.target.value);
                        }}
                      />
                    </div>
                  </fieldset>
                  <fieldset className="mt-2">
                    <label htmlFor="Ramal" className="font-bold">
                      Ramal
                    </label>
                    <div className="mt-1">
                      <InputText
                        id="Ramal"
                        className="rounded-sm ring-primary ring-1 px-2 py-1 w-full"
                        placeholder="Ramal do Usuário"
                        maxLength="4"
                        value={modalData.ramal || ""}
                        onChange={(e) => {
                          editableItem("ramal", e.target.value);
                        }}
                      />
                    </div>
                  </fieldset>
                  <fieldset className="mt-2">
                    <label htmlFor="Role" className="font-bold">
                      Setor
                    </label>
                    <div className="mt-1">
                      <select
                        id="Role"
                        className="w-full"
                        value={modalData.setor_id || ""}
                        onChange={(e) => {
                          editableItem("setor_id", e.target.value);
                        }}
                      >
                        <option value="" disabled>
                          Escolha uma opção
                        </option>
                        {setores.map((e) => {
                          return (
                            <option key={e.id} value={e.id}>
                              {e.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </fieldset>
                  <fieldset className="mt-2">
                    <label htmlFor="Role" className="font-bold">
                      Permissão
                    </label>
                    <div className="mt-1">
                      <select
                        id="Role"
                        className="w-full"
                        value={modalData.role || ""}
                        onChange={(e) => {
                          editableItem("role", e.target.value);
                        }}
                      >
                        <option value="" disabled>
                          Escolha uma opção
                        </option>
                        {roles.map((e) => {
                          return (
                            <option key={e} value={e}>
                              {e}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </fieldset>
                </div>
                <div
                  className={`mt-6 bg-gray-100 rounded-sm ring-gray-300 ring-1 hover:ring-primary transition ${
                    permissionOpen ? "h-full" : "h-15"
                  } overflow-hidden`}
                >
                  <div
                    className="flex justify-between items-center px-4 py-4"
                    onClick={() => setPermissionOpen(!permissionOpen)}
                  >
                    <h3 className="text-lg font-bold">Serviços Ativos</h3>
                    <IoIosArrowDown
                      className={`${
                        permissionOpen ? "rotate-180" : "rotate-0"
                      } transition`}
                    />
                  </div>
                  <div className="px-8 py-4">
                    {modalData?.permission
                      ? modalData.permission.map((p) => {
                          return (
                            <>
                              <div
                                key={p.service_id}
                                id={p.service_id}
                                className="mt-6"
                              >
                                <div>
                                  <h3 className="font-bold">
                                    {p.service.name}
                                  </h3>
                                  <p>{p.service.description}</p>
                                  <div>
                                    <div>
                                      <Checkbox
                                        className="mr-2 mt-1"
                                        name="view"
                                        id="View"
                                        onChange={(e) => {
                                          editablePermission(
                                            p.service_id,
                                            "active",
                                            e.target.checked ? true : false
                                          );
                                        }}
                                        checked={p.active || false}
                                      />
                                      <span>
                                        Ativar serviço para o usuário?
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          );
                        })
                      : ""}
                  </div>
                </div>
              </div>
              <div className="flex justify-end items-center mt-4">
                <Button
                  label="Salvar"
                  onClick={() => {
                    saveItem(modalData.id || null);
                  }}
                  className="btn-primary"
                />

                <Button
                  label="Cancelar"
                  data-autofocus
                  onClick={() => {
                    setOpenModalEdit(false);
                    clearModal();
                  }}
                  className="btn-danger ml-3"
                />
              </div>
            </div>
          </Dialog>

          <Toast ref={toast} className="mt-20" />
          <ConfirmDialog />
        </div>
      </div>
    </>
  );
};

export default PainelAdmin;
