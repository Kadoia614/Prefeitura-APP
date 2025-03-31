import PropTypes from "prop-types";

const HanlerError = ({ Error }) => {
  return (
    <div className="container bg-white">
      <h1 className="text-center">
        {Error == 404 || Error == undefined ? (
          <p>
            Ops, Serviço não encontrado 
            <br />
            <span className="text-danger">404</span>!!!
          </p>
        ) : (
          <p>
            Ops, tivemos um probleminha
            <br /> 
            <span className="text-danger">{Error}</span>
          </p>
        )}
      </h1>
    </div>
  );
};

HanlerError.propTypes = {
  Error: PropTypes.any,
};

export default HanlerError;
