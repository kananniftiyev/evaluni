function Field(props) {
  return (
    <>
      <input
        className="field px-4 py-4"
        type={props.type || "text"} // Default type is 'text' if not provided
        placeholder={props.text}
        value={props.value}
        onChange={props.onChange}
      />
    </>
  );
}

export default Field;
