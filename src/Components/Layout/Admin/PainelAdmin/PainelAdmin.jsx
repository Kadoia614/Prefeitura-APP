import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { IoIosArrowDown } from "react-icons/io";
import Table from "../../../shared/Table/Table";
import TableRow from "../../../shared/Table/TableRow";
import TableCol from "../../../shared/Table/TableCol";
import ActionButton from "../../../shared/Table/ActionButton";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

import API from "../../../../../service/API";
import HanlerError from "../../../middleware/HandleError";
import Loading from "../../../shared/Loading";
import AlertInfo from "../../../shared/alert/AlertInfo";

const PainelAdmin = () => {
  let [tableData, setTableData] = useState([]);

  let [roles, setRoles] = useState([]);
  let [setores, setSetores] = useState([]);

  let [openModalEdit, setOpenModalEdit] = useState(false);
  let [modalData, setModalData] = useState([]);
  let [permissionOpen, setPermissionOpen] = useState(false);

  let [excludeModalOpen, setExcludeModalOpen] = useState(false);
  let [excludeModal, setExcludeModal] = useState([]);

  let [alertPostit, setAlertPostit] = useState(null);
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState(false);

  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const loadTable = () => {
    fetchData();
  };

  //#region REMOVE ITEMS

  const toRemove = (item) => {
    setExcludeModal(item.id);
    setExcludeModalOpen(true);
  };

  const removeItem = async (id) => {
    setLoading(true);
    try {
      const response = await API.delete(`/user/${id}`);
      setAlertPostit([`Excluido com sucesso ${response.status}`, "success"]);
    } catch (error) {
      setAlertPostit([`${error.response.data}`, "danger"]);
    } finally {
      setExcludeModalOpen(false);
      loadTable();
      setLoading(false);
    }
  };
  //#endregion REMOVE ITEMS

  //#region EDIT / CREATE ITEMS
  const toSave = (item) => {
    setModalData(item);
    setOpenModalEdit(true);
  };

  const saveItem = async (id) => {
    if (!/^[A-Z0-9._%+-]+@itapecerica+\.sp\.gov\.br$/i.test(modalData.email)) {
      setAlertPostit(["Email inválido", "danger"]);
      return;
    }

    if (!id) {
      console.log(modalData)
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
        setAlertPostit([`Salvo com sucesso`, "success"]);
      } catch (error) {
        setAlertPostit([`${error.response.data}`, "danger"]);
      } finally {
        loadTable();
      }
      return;
    }

    try {
      console.log(modalData)
      const response = await API.put(`/user/${id}`, { user: modalData });
      clearModal();
      setOpenModalEdit(false);
      setAlertPostit([`Salvo com sucesso ${response.status}`, "success"]);
    } catch (error) {
      setAlertPostit([`${error.response.data}`, "danger"]);
    } finally {
      loadTable();
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
          >
            Cadastrar usuário
          </button>

          <Table
            header={[
              "#",
              "Nome",
              "Email",
              "Ramal",
              "Setor",
              "Permissão",
              "Editar",
              "Excluir",
            ]}
            data={tableData}
            campos={["id", "name", "email", "ramal", "role"]}
            buttons={[
              ["btn-primary", toSave, "edit"],
              ["btn-danger", toRemove, "delete"],
            ]}
          >
            {tableData.map((item) => {
              return (
                <TableRow key={item.id}>
                  <TableCol>{item.id}</TableCol>
                  <TableCol>{item.name}</TableCol>
                  <TableCol>{item.email}</TableCol>
                  <TableCol>{item.ramal}</TableCol>
                  <TableCol>{item.setor.name}</TableCol>
                  <TableCol>{item.role}</TableCol>
                  <TableCol>
                    <ActionButton
                      action="edit"
                      type="btn-primary"
                      handdler={toSave}
                      item={item}
                    />
                  </TableCol>
                  <TableCol>
                    <ActionButton
                      action="delete"
                      type="btn-danger"
                      handdler={toRemove}
                      item={item}
                    />
                  </TableCol>
                </TableRow>
              );
            })}
          </Table>

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
                      <div className="mt-3 text-left sm:mt-0 w-full">
                        <DialogTitle
                          as="h3"
                          className="text-lg font-semibold text-gray-900"
                        >
                          {modalData.id
                            ? "Atualizar Usuário"
                            : "Cadastrar usuário"}
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
                                <label htmlFor="Name" className="font-bold">
                                  Nome
                                </label>
                                <div className="mt-1">
                                  <input
                                    type="text"
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
                                  <input
                                    type="email"
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
                                  <input
                                    type="email"
                                    id="Ramal"
                                    className="rounded-sm ring-primary ring-1 px-2 py-1 w-full"
                                    placeholder="Ramal do Usuário"
                                    maxLength={"4"}
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
                                onClick={() =>
                                  setPermissionOpen(!permissionOpen)
                                }
                              >
                                <h3 className="text-lg font-bold">
                                  Serviços Ativos
                                </h3>
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
                                                  <input
                                                    className="mr-2 mt-1"
                                                    type="checkbox"
                                                    name="view"
                                                    id="View"
                                                    onChange={(e) => {
                                                      editablePermission(
                                                        p.service_id,
                                                        "active",
                                                        e.target.checked
                                                          ? true
                                                          : false
                                                      );
                                                    }}
                                                    checked={p.active || false}
                                                  />
                                                  <span>
                                                    Ativar serviço para o
                                                    usuário?
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
        </div>
      </div>
    </>
  );
};

export default PainelAdmin;
