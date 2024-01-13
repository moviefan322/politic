import { useEffect, useState } from "react";


const Timer = () => {
  const [milliseconds, setMilliseconds] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMilliseconds((prevMilliseconds) => {
        if (prevMilliseconds === 99) {
          setSeconds((prevSeconds) => {
            if (prevSeconds === 59) {
              setMinutes((prevMinutes) => prevMinutes + 1);
              return 0; // Reset seconds after 59
            }
            return prevSeconds + 1;
          });
          return 0; // Reset milliseconds after 99
        } else {
          return prevMilliseconds + 1;
        }
      });
    }, 10); // 10 ms for a more accurate 100 milliseconds increment

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Function to format time
  const formatTime = (unit: number) => unit.toString().padStart(2, "0");

  // Display the time
  return (
    <div>
      {formatTime(minutes)}:{formatTime(seconds)}:{formatTime(milliseconds)}
    </div>
  );
};

export default Timer;
