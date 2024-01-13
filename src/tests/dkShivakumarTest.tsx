import { useEffect, useState } from "react";
import * as d3 from "d3";
import styles from "@/tests/ericAdamsTest.module.css";
import { TweetData } from "@/types/TweetData";
import { start } from "repl";

const DkShivaKumarTest = () => {
  const [seconds, setSeconds] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [min, setMin] = useState<number>(0);
  const [color, setColor] = useState<string>("");
  const [startTimer, setStartTimer] = useState(false);
  const [GPTResponse, setGPTResponse] = useState<TweetData[] | null>(null);
  const [randomTweet, setRandomTweet] = useState<string | null>(null);
  const params = {
    country: "United States",
    candidate: "d_k_shivakumar",
    platform: "twitter",
    keywords: [],
    negTweetCutoff: 50,
    posTweetCutoff: 50,
    dateRange: null,
    showChart: false,
  };

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | null | undefined = null;
    if (startTimer) {
      interval = setInterval(() => {
        if (!seconds) {
          setSeconds(0);
        } else {
          setSeconds((prevSeconds) =>
            prevSeconds !== null ? prevSeconds + 1 : null
          );
        }
      }, 100);
    } else if (!startTimer && seconds !== 0) {
      clearInterval(interval as unknown as number);
    }
    return () => clearInterval(interval as unknown as number);
  }, [startTimer, seconds]);

  useEffect(() => {
    if (startTimer) {
      d3.csv(`data2/d_k_shivakumar_twitter_data.csv`)
        .then((d) => {
          let typedData: d3.DSVRowString<string>[] = d;
          if (params.keywords.length > 0) {
            typedData = typedData.filter((tweet) =>
              params.keywords.some((keyword) => tweet.Content.includes(keyword))
            );
          }
          const modifiedData: TweetData[] = typedData
            .map((tweet) => {
              if (tweet.date) {
                return {
                  content: tweet.Content,
                  externalLinkContent: [tweet["External Link Content"]],
                  externalLinks: [tweet["External links"]],
                  mentionedUsers: [tweet["Mentioned Users"]], // Wrap the value in an array
                  translatedContent: tweet["Translated content"],
                  tweetID: tweet["Tweet ID"],
                  likes: +tweet.Likes || 0,
                  negativeSentiment: +tweet["Negative sentiment"] || 0,
                  neutralSentiment: +tweet["Neutral sentiment"] || 0,
                  positiveSentiment: +tweet["Positive sentiment"] || 0,
                  quoteTweets: +tweet["Quote tweets"] || 0,
                  replies: +tweet.Replies || 0,
                  retweets: +tweet.Retweets || 0,
                  views: +tweet.Views || 0,
                  url: tweet.URL,
                  user: tweet.User,
                  verifiedStatus: tweet["Verified status"],
                  date: new Date(tweet.date),
                  media: tweet.media,
                };
              } else {
                return null;
              }
            })
            .filter((tweet): tweet is TweetData => tweet !== null);

          setGPTResponse(modifiedData);
          setStartTimer(false);
          setColor("green");
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  }, [startTimer]);

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
        <div>Test D.K. Shivakumar:</div>
        <div className="text-center fs-1">
          {!startTimer && !GPTResponse ? (
            <>
              {min}:{formatSeconds(seconds ? seconds : 0)}
              <button
                className="btn btn-lg btn-success fs-3 m-3"
                onClick={handleStart}
              >
                Start
              </button>
            </>
          ) : (
            <>
              {min}:{formatSeconds(seconds ? seconds : 0)}
            </>
          )}
        </div>
      </div>
      <div className={`border border-dark bg-dark ${styles.response}`}>
        {error && <p>{error}</p>}
        {GPTResponse && !error && (
          <>
            <p>Number of Tweets: {GPTResponse.length}</p>
            <p>Random Tweet: {generateRandomTweet()}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default DkShivaKumarTest;
