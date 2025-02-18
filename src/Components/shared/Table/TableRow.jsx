import PropTypes from "prop-types";

const TableRow = ({children}) => {
  return (
    <tr>
      {children}
    </tr>
  );
};

TableRow.propTypes = {
  children: PropTypes.any.isRequired,
};

export default TableRow;
