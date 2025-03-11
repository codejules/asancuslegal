import Spinner from "./Spinner";

const SubmitButton = ({ isSubmitting, isSent }) => {
  return (
    <button
      name="submit"
      type="submit"
      className={`mt-6 w-fit flex mx-auto transition duration-300 ease-in text-white bg-primary border border-white font-medium rounded-sm text-sm px-5 py-2.5 mb-2 ${isSubmitting || isSent
          ? "opacity-50 cursor-not-allowed"
          : "hover:cursor-pointer hover:border-primary hover:scale-95"
        }`}
      disabled={isSubmitting || isSent}
    >
      {isSubmitting ? (
        <span className="flex items-center gap-2">
          <Spinner />
          Enviando email...
        </span>
      ) : isSent ? (
        "Mensaje enviado correctamente ✅"
      ) : (
        "Enviar mensaje"
      )}
    </button>
  );
};

export default SubmitButton;
