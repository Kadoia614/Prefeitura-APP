import { Routes, Route } from "react-router";

import Header from "./Components/Main/Header";
import Login from "./Components/Main/Login";
import ChangePwd from "./Components/Main/changePwd";

import Services from "./Components/Layout/Services";
import PainelAdmin from "./Components/Layout/Admin/PainelAdmin/PainelAdmin";
import PainelServices from "./Components/Layout/Admin/painelServices/painelServices";
import Setor from "./Components/Layout/Admin/Setor/Setor";

import DemandasTi from "./Components/Layout/DemandasTI/DemandasTi";
import AllDemandas from "./Components/Layout/DemandasTI/AllDemandas/AllDemandas";
import UserDemandas from "./Components/Layout/DemandasTI/UserDemandas/UserDemandas";
import HistoryDemandas from "./Components/Layout/DemandasTI/HistoryDemandas/HistoryDemandas";

import ProtectRoutes from "./Components/middleware/ProtectRoutes";
import HandleError from "./Components/middleware/HandleError";
import Admin from "./Components/Layout/Admin/Admin";
import Footer from "./Components/Main/Footer";

function App() {
  return (
    <>
      <div id="Main" className="h-full flex flex-col">
        <Header />
        <Routes>
          <Route path="/login" index element={<Login />} />

          <Route path="/" element={<ProtectRoutes />}>
            <Route index element={<Services />} />
            <Route path="alterarsenha" element={<ChangePwd />} />

            <Route path="admin" element={<Admin />}>
              <Route index element={<PainelAdmin />} />
              <Route path="service" element={<PainelServices />} />
              <Route path="setor" element={<Setor />} />
            </Route>

            <Route path="demandasti" element={<DemandasTi />}>
              <Route index element={<UserDemandas />} />
              <Route path="alldemandas" element={<AllDemandas />} />
              <Route path="historicodemandas" element={<HistoryDemandas />} />
            </Route>
          </Route>
          
          <Route path="*" element={<HandleError />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
}

export default App;
