import { IoIosWarning } from "react-icons/io";

interface ErrorProps {
  error: string;
}

const Error = ({ error }: ErrorProps) => {
  return (
    <div className={`chart p-5 m-5 error`}>
      <div className="d-flex flex-row warning">
        {" "}
        <IoIosWarning size={80} />
        <h1 className="mt-5">{error}</h1>
        <IoIosWarning size={80} />
      </div>

      <h5>
        This is a demo. For the time being, the only candidates that will fetch
        results are Eric Adams and D.K. Shivakumar, and only on Twitter. We
        apologize for the limited functionality of the application at the
        present time, but the production application will be have comprehensive
        data sets for all candidates.
      </h5>
    </div>
  );
};

export default Error;
