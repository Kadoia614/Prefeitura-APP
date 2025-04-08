import { useContext, useEffect, useState } from "react";
import API from "../../../../../service/API";
import HanlerError from "../../../middleware/HandleError";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { UserContext } from "/src/context/UserContextFile";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

const UserDemandas = () => {
  let { scopo } = useContext(UserContext);

  let [tableData, setTableData] = useState([]);
  let [error, setError] = useState(false);
  let [modalData, setModalData] = useState([]);
  let [setores, setSetores] = useState([]);
  let [openModalEdit, setOpenModalEdit] = useState(false);

  const fetchData = async () => {
    try {
      let response = await API.get("/demandas/history");
      setTableData(response.data.demandas);
      setSetores(response.data.setores.setores);
      console.log(response.data)
    } catch (error) {
      setError(error.status);
    }
  };

  // apaga os dados do modal
  const clearModal = () => {
    setModalData({});
  };

  //get a cada certo time (10seg nesse caso)
  useEffect(() => {
    fetchData();

    setInterval(() => {
      fetchData();
    }, 10000);
  }, []);

  // gerenciamento de erros para caso algo de errado ocorra durante as requisições
  if (error) {
    return <HanlerError error={error} />;
  }

  return (
    <div id="AllDemandasTi">
      <div>
        <button
          className="btn-primary"
          onClick={() => {
            setOpenModalEdit(true);
            clearModal();
          }}
        >
          Cadastrar demanda
        </button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
        <DataTable
          id="demandasTable"
          value={tableData}
          paginator
          rows={25}
          stripedRows
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
          className="min-w-full p-4"
          rowClassName="hover:bg-gray-100 transition duration-200"
        >
          <Column
            headerClassName="p-2"
            field="patrimonio"
            header="Patrimônio"
            sortable
            filter
            filterPlaceholder="Pesquisar patrimônio"
            filterMatchMode="contains"
            className="text-sm text-gray-800 p-4 whitespace-nowrap"
          />
          <Column
            headerClassName="p-2"
            field="description"
            header="Descrição"
            className="text-sm text-gray-800 p-4"
          />
          <Column
            headerClassName="p-2"
            field="prioridade"
            header="Prioridade"
            sortable
            filter
            filterPlaceholder="Pesquisar prioridade"
            filterMatchMode="contains"
            className="text-sm text-gray-800 p-4"
            body={(rowData) => {
              const map = {
                0: ["Baixa", "bg-green-100 text-green-700"],
                1: ["Média", "bg-yellow-100 text-yellow-700"],
                2: ["Alta", "bg-red-100 text-red-700"],
                3: ["Gabinete", "bg-primary-500 text-white"],
              };
              const [label, color] = map[rowData.prioridade] || [
                "-",
                "text-gray-500",
              ];
              return (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}
                >
                  {label}
                </span>
              );
            }}
          />
          <Column
            headerClassName="p-2"
            field="status"
            header="Status"
            sortable
            filter
            filterPlaceholder="Pesquisar status"
            filterMatchMode="contains"
            className="text-sm text-gray-800 p-4"
            body={(rowData) => {
              const map = {
                0: ["Aberto", "bg-green-100 text-green-700"],
                1: ["Em atendimento", "bg-yellow-100 text-yellow-700"],
                2: ["Aguardando resposta", "bg-blue-100 text-blue-700"],
                3: ["Concluído", "bg-gray-100 text-gray-700"],
              };
              const [label, color] = map[rowData.status] || [
                "-",
                "text-gray-500",
              ];
              return (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}
                >
                  {label}
                </span>
              );
            }}
          />
          <Column
            headerClassName="p-2"
            field="createdAt"
            header="Abertura"
            sortable
            filter
            filterPlaceholder="Pesquisar data"
            filterMatchMode="contains"
            className="text-sm text-gray-800 p-4 whitespace-nowrap"
            body={(rowData) =>
              new Date(rowData.createdAt).toLocaleDateString("pt-BR")
            }
          />
          <Column
            headerClassName="p-2"
            field="updatedAt"
            header="Atualização"
            sortable
            filter
            filterPlaceholder="Pesquisar data"
            filterMatchMode="contains"
            className="text-sm text-gray-800 p-4 whitespace-nowrap"
            body={(rowData) =>
              new Date(rowData.updatedAt).toLocaleDateString("pt-BR")
            }
          />
          {scopo == 1 || scopo == 2 ? (
            <Column
              header="Ações"
              body={(rowData) => (
                <div className="flex flex-wrap gap-2">
                  <button
                    className="flex items-center gap-1 px-3 py-1 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                    onClick={() => {
                      setOpenModalEdit(true);
                      setModalData(rowData);
                    }}
                  >
                    <i className="pi pi-pencil" /> Ver informações
                  </button>
                  {/* {(scopo == 1 ) && rowData.status == 3 && (
                    <button
                      className="flex items-center gap-1 px-3 py-1 text-xs text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
                      onClick={() => {
                        toFinish(rowData.id);
                      }}
                    >
                      <i className="pi pi-check" /> Excluir
                    </button>
                  )} */}
                </div>
              )}
            />
          ) : (
            ""
          )}
        </DataTable>
      </div>

      {/* Arrumar essa cagada aqui */}
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

                    <div className="mt-2">
                      <div id="UserConfig">
                        <div
                          id="Data"
                          className="sm:grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                          <fieldset className="mt-2 flex md:flex-row flex-col gap-4">
                            <div className="w-full">
                              <label htmlFor="Setor responsável" className="font-bold">
                                Patrimônio
                              </label>
                              <div className="mt-1">
                                <input
                                  type="text"
                                  id="Setor"
                                  className="input"
                                  placeholder={setores.find(setor => {return setor.id === modalData.setor_id})?.name}
                                  required
                                  disabled={"disabled"}
                                />
                              </div>
                            </div>

                            <div className="w-full">
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
                                  disabled={"disabled"}
                                />
                              </div>
                            </div>
                          </fieldset>
                          <fieldset className="mt-2 col-span-2">
                            <label htmlFor="Descricao" className="font-bold">
                              Descrição
                            </label>
                            <div className="mt-1">
                              <textarea
                                id="Descricao"
                                className="input w-full"
                                placeholder="Descrição do chamado"
                                value={modalData.description || ""}
                                disabled={"disabled"}

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
                                disabled={"disabled"}
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
                                disabled={"disabled"}
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
                  data-autofocus
                  onClick={() => {
                    setOpenModalEdit(false);
                    clearModal();
                  }}
                  className="btn-primary sm:mr-3"
                >
                  Fechar
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
