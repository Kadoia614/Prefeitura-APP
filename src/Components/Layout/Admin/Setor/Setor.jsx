import { useEffect, useState, useRef } from "react";
import API from "../../../../../service/API";
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
import { Toast } from "primereact/toast";
import InputField from "../../../shared/InputField";

const Setor = () => {
  const [tableData, setTableData] = useState([]);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [modalData, setModalData] = useState({});
  const [excludeModalOpen, setExcludeModalOpen] = useState(false);
  const [excludeModal, setExcludeModal] = useState(null);
  const [error, setError] = useState(null);
  const toast = useRef(null);

  const fetchData = async () => {
    try {
      const response = await API.get("/setor");
      setTableData(response.data.setores);
    } catch (error) {
      setError(error.status);
      showToast("error", "Failed to load sectors: " + error.message);
    }
  };

  const loadTable = () => {
    fetchData();
  };

  const handleSave = async (id) => {
    try {
      if (!id) {
        await API.post("/setor", { setor: modalData });
        showToast("success", "Sector created successfully!");
      } else {
        await API.put(`/setor/${id}`, { setor: modalData });
        showToast("success", "Sector updated successfully!");
      }
      loadTable();
      clearModal();
      setOpenModalEdit(false);
    } catch (error) {
      showToast("error", "Failed to save sector: " + error.message);
    }
  };

  const handleRemove = async (id) => {
    try {
      await API.delete(`/setor/${id}`);
      showToast("success", "Sector deleted successfully!");
      loadTable();
    } catch (error) {
      showToast("error", "Failed to delete sector: " + error.message);
    } finally {
      setExcludeModalOpen(false);
    }
  };

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

  const editableItem = (key, value) => {
    setModalData((prev) => ({ ...prev, [key]: value }));
  };
  if (error) {
    return <HandleError Error={error} />;
  }

  return (
    <>
      <div id="PainelAdmin" className="p-4 bg-gray-50">
        <Toast ref={toast}/>
        <Button
          label="Cadastrar Setor"
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
                onClick={() => {
                  setExcludeModal(rowData.id);
                  setExcludeModalOpen(true);
                }}
              />
            )}
          />
        </DataTable>

        {/* Edit/Create Sector Modal */}
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
                      <DialogTitle as="h3" className="text-lg font-semibold text-gray-900">
                        {modalData.id ? "Atualizar Setor" : "Cadastrar Setor"}
                      </DialogTitle>
                      <div className="mt-2">
                        <div id="UserConfig">
                          <div id="Data" className="sm:grid grid-cols-1 gap-4">
                            {/* Name Field */}
                            <InputField
                              id="Name"
                              label="Nome do Setor"
                              value={modalData.name || ""}
                              onChange={(e) => editableItem("name", e.target.value)}
                            />
                            {/* Description Field */}
                            <InputField
                              id="Description"
                              label="Descrição do Setor"
                              value={modalData.description || ""}
                              onChange={(e) => editableItem("description", e.target.value)}
                              isTextArea
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <Button
                    label="Salvar"
                    onClick={() => handleSave(modalData.id || null)}
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
                      <DialogTitle as="h3" className="text-lg font-semibold text-gray-900">
                        Deletar Setor
                      </DialogTitle>
                      <p className="text-red-500 font-bold mt-2">
                        Tem certeza que deseja excluir esse item? Os dados excluídos não poderão ser recuperados.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 flex sm:flex-row-reverse sm:px-6">
                  <Button
                    label="Excluir"
                    onClick={() => handleRemove(excludeModal)}
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
    </>
  );
};

export default Setor;