function Field(props){
    return(
        <>
            <input className="field px-4 py-4" type="text" placeholder={props.text} />
        </>
    )
}

export default Field;