const SelectField = ({ id, label, value, options, onChange }) => (
    <fieldset className="mt-2">
      <label htmlFor={id} className="font-bold text-gray-700">{label}</label>
      <div className="mt-1">
        <select
          id={id}
          className="rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 w-full"
          value={value}
          onChange={onChange}
        >
          <option value="" disabled>Escolha uma opção</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
    </fieldset>
  );

  export default SelectField;