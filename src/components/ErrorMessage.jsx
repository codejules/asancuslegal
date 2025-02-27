const ErrorMessage = ({ error }) => error && (
    <div className="text-red-500 text-sm mb-2 p-2 bg-red-100 rounded">
      {error}
    </div>
  );
  
  export default ErrorMessage;
  