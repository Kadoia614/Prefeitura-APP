import PropTypes from "prop-types";

const TableCol = ({children}) => {
  return (
    <td className="not-last:pr-3">
      {children}
    </td>
  );
};

TableCol.propTypes = {
  children: PropTypes.any.isRequired,
};

export default TableCol;
