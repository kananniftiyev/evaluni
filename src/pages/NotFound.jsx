import "./css/NotFound.css";
import { useMediaQuery } from "react-responsive";

const NotFound = () => {
  const isBigScreen = useMediaQuery({ query: "(min-width: 1824px)" });

  const isRetina = useMediaQuery({ query: "(max-width: 600px)" });

  return (
    <>
      <div className="overlay flex justify-center items-center">
        <div
          className={`items-center not-found rounded-lg  flex flex-col justify-center mx-auto font-semibold text-2xl ${
            isRetina ? "" : "w-1/3"
          }`}
        >
          <h1 className={`mb-5 ${isBigScreen ? "text-6xl" : "text-5xl"}`}>
            ❌
          </h1>
          <h2>Something Went Wrong</h2>
          <p className="mt-2 text-base font-normal">Page has not been found</p>
        </div>
      </div>
    </>
  );
};

export default NotFound;
