import { InputText } from "primereact/inputtext";

const InputField = ({ id, label, value, onChange, maxLength }) => (
    <fieldset className="mt-2">
      <label htmlFor={id} className="font-bold text-gray-700">{label}</label>
      <div className="mt-1">
        <InputText
          id={id}
          className="rounded-md border-gray-300 ps-2 py-1 focus:border-blue-500 focus:ring focus:ring-blue-200 w-full"
          placeholder={`Enter ${label}`}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
        />
      </div>
    </fieldset>
  );

  export default InputField;