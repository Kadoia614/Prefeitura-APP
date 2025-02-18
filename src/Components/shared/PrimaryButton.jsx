import PropTypes from "prop-types";

const PrimaryButton = ({ text, handler }) => {
  return (
    <button
      className="w-full mt-4 px-2 py-1 bg-primary hover:bg-primaryhover text-white font-bold rounded-sm cursor-pointer"
      onClick={handler}
    >
      {text}
    </button>
  );
};
PrimaryButton.propTypes = {
  text: PropTypes.string.isRequired,
  handler: PropTypes.func.isRequired,
};

export default PrimaryButton;
