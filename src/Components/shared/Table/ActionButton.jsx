import { FaTrash, FaUser, FaEdit } from "react-icons/fa";
import { GiConfirmed } from "react-icons/gi";

GiConfirmed
import PropTypes from "prop-types";

const ActionButton = ({ item, action, handdler, type }) => {
  let icon;
  switch (action) {
    case "edit":
      icon = <FaEdit />;
      break;
    case "delete":
      icon = <FaTrash />;
      break;
    case "assume":
      icon = <FaUser />;
      break;
      case "confirm":
        icon = <GiConfirmed />;
        break;
    default:
      icon = null;
  }

  return (
    <button
      className={`${type} border-radius-5 p-2 text-white my-1`}
      onClick={() => {
        handdler(item);
      }}
    >
      {icon}
    </button>
  );
};

ActionButton.propTypes = {
  item: PropTypes.any.isRequired,
  action: PropTypes.string.isRequired,
  handdler: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default ActionButton;
