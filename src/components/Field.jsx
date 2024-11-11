function Field(props) {
  return (
    <input
      className={`field px-4 py-4 ${
        props.red ? "border-red-500" : "border-gray-300"
      } border-2`}
      type={props.type || "text"}
      placeholder={props.text}
      name={props.name}
      value={props.value}
      onChange={props.onChange}
    />
  );
}

export default Field;
