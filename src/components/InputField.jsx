const InputField = ({ id, type, name, placeholder, required, value, onChange, error }) => (
    <div key={id}>
      <label for={id} htmlFor={id} className="block mb-2 text-sm font-medium text-white" />
      {type === "textarea" ? (
        <textarea
          placeholder={placeholder}
          rows={4}
          className={`block p-2.5 w-full text-sm text-gray-300 rounded-sm border ${error ? 'border-red-500' : 'border-gray-300'} focus:ring-primary focus:border-primary`}
          name={name}
          id={id}
          required={required}
          value={value}
          onInput={onChange}
          maxLength={1000}
        />
      ) : (
        <input
          placeholder={placeholder}
          className={`border ${error ? 'border-red-500' : 'border-gray-300'} text-gray-300 text-sm rounded-sm focus:ring-primary focus:border-primary block w-full p-2.5`}
          type={type}
          name={name}
          id={id}
          required={required}
          value={value}
          onInput={onChange}
          maxLength={type === "email" ? 100 : 50}
          autoComplete={type === "email" ? "email" : "off"}
        />
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
  
  export default InputField;
  