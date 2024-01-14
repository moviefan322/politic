import { IoIosWarning } from "react-icons/io";

const MobileNote = () => {
  return (
    <div className={`chart p-5 m-5 error`}>
      <div className="d-flex flex-column warning">
        {" "}
        <h1 className="mt-5 text-center">
          {" "}
          <IoIosWarning size={80} /> <div style={{ height: "20px" }}></div>
          Mobile View Detected
        </h1>
      </div>

      <h5>
        This is a demo. For the time being, the application is designed to be
        viewed on desktop only. Please view on a desktop for the best
        experience.
      </h5>
      <div style={{ height: "20px" }}></div>
    </div>
  );
};

export default MobileNote;
