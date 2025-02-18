import API from "/src/../service/API";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import HanlerError from "../middleware/HandleError";

import Card from "../shared/Card";

// eslint-disable-next-line react/prop-types
function Services() {
  const [services, setServices] = useState([]); // Inicializado como array vazio
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await API.get("/services");
      setServices(response.data.services); // Atualiza o estado com os serviços
    } catch (error) {
      if (error.status == 401) {
        return navigate("/login");
      }
      setError(error);
      return []; // Retorna um array vazio em caso de erro
    }
  };

  // Função para configurar os serviços
  const getService = async () => {
    await fetchData(); // Aguarda a resposta do fetchData
  };

  useEffect(() => {
    getService();
  }, []);

  if (error) {
    return <HanlerError Error={error} />;
  }

  return (
    <>
      <div id="Services">
        <div className="grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-3 gap-y-9">
          {Array.isArray(services) &&
            services.map((service) => (
              <Card
                key={service.id}
                title={service.name}
                descrition={service.description}
                towhere={service.name}
                toref={`${service.url}`}
              >
                {service.name}
              </Card>
            ))}
        </div>
      </div>
    </>
  );
}

export default Services;
