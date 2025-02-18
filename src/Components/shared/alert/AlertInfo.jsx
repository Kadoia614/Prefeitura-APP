import PropTypes from "prop-types";
import { MdOutlineCancel } from "react-icons/md";

const AlertInfo = ({ tipo, menssagem, setAlert }) => {
  return (
    <div className={`flex justify-between items-center bg-${tipo} p-2 mt-3 text-center`}>
    <p className={`block text-sm`}>{menssagem}</p>
    <MdOutlineCancel className="text-2xl cursor-pointer" onClick={() => setAlert(null)}/>

  </div>
  );
};

AlertInfo.propTypes = {
  tipo: PropTypes.string.isRequired,
  menssagem: PropTypes.string.isRequired,
  setAlert: PropTypes.func.isRequired,
};

export default AlertInfo;
