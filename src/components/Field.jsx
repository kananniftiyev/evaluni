function Field(props) {
  return (
    <input
      className={`field px-4 py-4 ${
        props.red ? "border-red-500" : "border-gray-300"
      } border-2`}
      type={props.type || "text"} // Default type is 'text' if not provided
      placeholder={props.text}
      name={props.name} // Ensure to use the name prop
      value={props.value}
      onChange={props.onChange} // Event handler for input changes
    />
  );
}

export default Field;
