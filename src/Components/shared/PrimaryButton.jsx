const PrimaryButton = ({ children, ...props }) => {
  return <button {...props} className="btn-primary w-full">{children}</button>;
}

export default PrimaryButton;