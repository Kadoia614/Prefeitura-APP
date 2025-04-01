import API from "/src/../service/API";
import { useEffect, useState } from "react";
import HanlerError from "../middleware/HandleError";

import { Card } from "primereact/card";
import { Button } from 'primereact/button';

// eslint-disable-next-line react/prop-types
function Services() {
  const [services, setServices] = useState([]); // Inicializado como array vazio
  const [error, setError] = useState(false);

  const fetchData = async () => {
    try {
      const response = await API.get("/service");
      setServices(response.data.services); // Atualiza o estado com os serviços
    } catch (error) {
      console.log(error.data.message);
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

  const cardFooter = (url, name) => {
    return (
      <>
        <a href={url}>
          <Button label={name} className="btn-primary w-full mt-4" />
        </a>
      </>
    );
  };

  return (
    <>
      <div id="Services" className="content">
        <div className="p-10 grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-3 gap-y-9">
          {Array.isArray(services) &&
            services.map((service) => (
              <Card
                key={service.id}
                title={service.name}
                subTitle={service.description}
                footer={cardFooter(service.url, service.name)}
                className="p-4"
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
