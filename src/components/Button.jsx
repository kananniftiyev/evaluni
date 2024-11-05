function Button(props) {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      className={`text-center rounded font-semibold px-8 py-4 ${
        props.disabled
          ? "bg-gray-400 text-gray-200 cursor-not-allowed"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
    >
      {props.text}
    </button>
  );
}

export default Button;
