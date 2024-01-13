import { useEffect, useState } from "react";
import * as d3 from "d3";
import styles from "@/tests/ericAdamsTest.module.css";
import { TweetData } from "@/types/TweetData";
import LineChart from "@/components/lineChart";
import ILoading from "@/types/ILoading";
import IParams from "@/types/Params";

const LineChartTest = () => {
  const [seconds, setSeconds] = useState(0);
  const [loading, setLoading] = useState<ILoading>({
    lineChart: false,
    histogram: false,
    topAccounts: false,
    selectedPosts: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [min, setMin] = useState<number>(0);
  const [color, setColor] = useState<string>("");
  const [startTimer, setStartTimer] = useState(false);
  const [GPTResponse, setGPTResponse] = useState<TweetData[] | null>(null);
  const [randomTweet, setRandomTweet] = useState<string | null>(null);
  const params: IParams = {
    candidate: "eric_adams",
    country: "United States",
    dateRange: "",
    keywords: [""],
    negTweetCutoff: 50,
    platform: "twitter",
    posTweetCutoff: 50,
    showChart: true,
  };

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


  const generateRandomTweet = () => {
    const randomIndex = Math.floor(Math.random() * GPTResponse!.length);
    return GPTResponse![randomIndex].content;
  };

  useEffect(() => {
    if (GPTResponse) {
      setRandomTweet(generateRandomTweet());
    }
  }, [GPTResponse]);

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
    setColor("yellow");
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
    <div
      className="gpt-test d-flex flex-row border border-4 border-dark my-5 align-items-center"
      style={{ backgroundColor: color }}
    >
      <div className="text col-4 m-3 border border-dark fw-bold fs-3 text-center bg-white">
        <div>Test Line Chart:</div>
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
        {error && <p>{error}</p>}
        <LineChart
          params={params}
          setLoading={setLoading}
          loading={loading}
          chartWidth={800}
        />
      </div>
    </div>
  );
};

export default LineChartTest;
