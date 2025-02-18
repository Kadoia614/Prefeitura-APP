import { Link } from "react-router";

// eslint-disable-next-line react/prop-types
const Card = ({ title, descrition, towhere, toref }) => {
  return (
    <div className="card p-4 flex flex-col justify-between shadow-2xl border-1 border-gray-200">
      <div>
        <div className="card-title">
          <h3 className="text-2xl">{title}</h3>
        </div>
        <div className="card-body mt-3">
          <p className="">{descrition}</p>
        </div>
      </div>
      <div className="card-footer">
        <Link
          to={toref}
          className="block btn-primary"
        >
          {towhere}
        </Link>
      </div>
    </div>
  );
};

export default Card;
