import { useEffect, useState } from "react";
import testGPT from "@/utils/gptTest";
import styles from "@/components/gptTestComp.module.css";

const GptTestComp = () => {
  const [seconds, setSeconds] = useState(0);
  const [min, setMin] = useState<number>(0);
  const [startTimer, setStartTimer] = useState(false);
  const [GPTResponse, setGPTResponse] = useState<string | null>(null);

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | null | undefined = null;
    if (startTimer) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 100);
    } else if (!startTimer && seconds !== 0) {
      clearInterval(interval as unknown as number);
    }
    return () => clearInterval(interval as unknown as number);
  }, [startTimer, seconds]);

  useEffect(() => {
    if (startTimer) {
      try {
        testGPT().then((result) => {
          setGPTResponse(result);
          setStartTimer(false);
        });
      } catch (err: any) {
        setGPTResponse(`Error: ${err.message}`);
      }
    }
  }, [startTimer]);

  useEffect(() => {
    if (seconds === 99 && !min) {
      setMin(1);
      setSeconds(0);
    }

    if (seconds === 99 && min) {
      setMin(min + 1);
      setSeconds(0);
    }
  }, [seconds]);

  const handleStart = () => {
    setStartTimer(true);
  };

  const handleStop = () => {
    setStartTimer(false);
  };

  const formatSeconds = (seconds: number) => {
    if (seconds < 10) {
      return "0" + seconds;
    } else {
      return seconds;
    }
  };

  return (
    <div className="gpt-test d-flex flex-row border border-4 border-dark my-5 align-items-center">
      <div className="text col-4 m-3 border border-dark fw-bold fs-3 text-center bg-white">
        <div>Test GPT response:</div>
        <div className="text-center fs-1">
          {!startTimer && !GPTResponse ? (
            <>
              {min}:{formatSeconds(seconds)}
              <button
                className="btn btn-lg btn-success fs-3 m-3"
                onClick={handleStart}
              >
                Start
              </button>
            </>
          ) : (
            <>
              {min}:{formatSeconds(seconds)}
            </>
          )}
        </div>
      </div>
      <div className={`border border-dark bg-dark ${styles.response}`}>
        {GPTResponse}
      </div>
    </div>
  );
};

export default GptTestComp;
