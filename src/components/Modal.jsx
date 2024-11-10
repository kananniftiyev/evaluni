import Button from "./Button";

const Modal = ({ isOpen, onClose, examId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
        <h2 className="text-xl font-semibold">Exam Created Successfully</h2>
        <p>
          Your exam ID is: <strong>{examId}</strong>
        </p>
        <div className="mt-4 flex justify-end">
          <Button text="Close" onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default Modal;
