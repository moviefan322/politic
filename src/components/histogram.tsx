import React, { useEffect, useState, useRef } from "react";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import styles from "./histogram.module.css";
import { TweetData, TweetsByDate } from "../types/TweetData";
import * as d3 from "d3";

const HistogramChart = () => {
  const [data, setData] = useState<TweetData[]>();
  const [sentimentData, setSentimentData] = useState<{
    positive: number[];
    negative: number[];
    neutral: number[];
  }>({
    positive: Array(100).fill(0),
    negative: Array(100).fill(0),
    neutral: Array(100).fill(0),
  });

  const svgRef = useRef<SVGSVGElement>(null);
  const svgWidth = 1000;
  const svgHeight = 600;

  useEffect(() => {
    d3.csv("data/eric_adams_twitter_data.csv").then((d) => {
      const modifiedData: TweetData[] = d
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

      setData(modifiedData);
    });
  }, []);

  // Organize data by sentiment
  useEffect(() => {
    if (data) {
      const sentimentCounts = {
        positive: Array(100).fill(0),
        negative: Array(100).fill(0),
        neutral: Array(100).fill(0),
      };

      data.forEach((tweet) => {
        // Assuming that sentiment values range from 0 to 99
        sentimentCounts.positive[Math.floor(tweet.positiveSentiment)] += 1;
        sentimentCounts.negative[Math.floor(tweet.negativeSentiment)] += 1;
        sentimentCounts.neutral[Math.floor(tweet.neutralSentiment)] += 1;
      });

      setSentimentData(sentimentCounts);
    }
  }, [data]);

  if (!data) return <p>Loading...</p>;

  console.log(sentimentData);
  return (
    <div>
      <svg ref={svgRef} width={svgWidth} height={svgHeight}></svg>

      <div className={styles.socials}>
        <FaFacebookF />
        <FaTwitter className={styles.twitter} />
        <FaInstagram />
        <FaYoutube />
      </div>
    </div>
  );
};

export default HistogramChart;
