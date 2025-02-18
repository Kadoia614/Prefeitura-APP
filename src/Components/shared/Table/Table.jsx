import PropTypes from "prop-types";

const Table = ({ header, children }) => {
  return (
    <div className="table-responsive overflow-x-scroll">
      <table className="table w-full mt-8">
        <thead>
          <tr>
            {header.map((e, index) => {
              return <th key={index} className={`pr-3 text-start`} >{e}</th>;
            })}
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {children}
        </tbody>
      </table>
    </div>
  );
};

Table.propTypes = {
  header: PropTypes.array.isRequired,
  children: PropTypes.any.isRequired,
};

export default Table;
