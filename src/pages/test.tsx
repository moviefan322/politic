import { useEffect, useState } from "react";
import testGPT from "@/utils/gptTest";
import styles from "@/pages/test.module.css";
import EricAdamsTest from "@/tests/ericAdamsTest";
import DkShivaKumarTest from "@/tests/dkShivakumarTest";
import GptTestComp from "@/tests/gptTestComp";

const Test = () => {
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

  return (
    <div className="container">
      <div className="d-flex flex-column justify-space-between">
        <GptTestComp />
        <EricAdamsTest />
        <DkShivaKumarTest />
        {/* <LineChartTest /> */}
      </div>
    </div>
  );
};

export default Test;
