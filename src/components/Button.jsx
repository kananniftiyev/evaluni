function Button(props) {
    return (
        <a className="text-center text-sky-400/100 rounded-full bg-blue-600 text-white font-semibold px-8 py-4" href={props.link}>
            {props.text}
        </a>
    );
}

export default Button;
