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
  const [dateRange, setDateRange] = useState<[Date, Date]>();
  const [totalTweets, setTotalTweets] = useState<number>(0);
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
      setTotalTweets(modifiedData.length);
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

      // replace tweet count with % of total tweets
      sentimentCounts.positive = sentimentCounts.positive.map(
        (count) => count / totalTweets
      );
      sentimentCounts.negative = sentimentCounts.negative.map(
        (count) => count / totalTweets
      );
      sentimentCounts.neutral = sentimentCounts.neutral.map(
        (count) => count / totalTweets
      );

      setSentimentData(sentimentCounts);
    }
  }, [data]);

  // Create the chart
  const svg = d3.select(svgRef.current);

  const MARGIN = { LEFT: 80, RIGHT: 20, TOP: 150, BOTTOM: 100 };
  const WIDTH = svgWidth - MARGIN.LEFT - MARGIN.RIGHT;
  const HEIGHT = svgHeight - MARGIN.TOP - MARGIN.BOTTOM;

  const g = svg
    .append("g")
    .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

  const x = d3.scaleLinear().range([0, WIDTH]);
  const y = d3.scaleLinear().range([HEIGHT, 0]);

  g.append("text")
    .text("Post Analysis")
    .attr("text-anchor", "start")
    .attr("x", -35)
    .attr("y", -50)
    .style("font-size", "25px")
    .attr("fill", "blue");

  g.append("rect")
    .attr("x", 165)
    .attr("y", -85)
    .attr("width", 20)
    .attr("height", 10)
    .attr("fill", "green")
    .attr("stroke-width", 2);

  g.append("text")
    .text("Positive Sentiment")
    .attr("text-anchor", "start")
    .attr("x", 195)
    .attr("y", -77)
    .style("font-size", "12px")
    .attr("fill", "blue");

  g.append("rect")
    .attr("x", 165)
    .attr("y", -65)
    .attr("width", 20)
    .attr("height", 10)
    .attr("fill", "gray")
    .attr("stroke-width", 2)

  g.append("text")
    .text("Neutral Sentiment")
    .attr("text-anchor", "start")
    .attr("x", 195)
    .attr("y", -57)
    .style("font-size", "12px")
    .attr("fill", "blue");

  g.append("rect")
    .attr("x", 305)
    .attr("y", -85)
    .attr("width", 20)
    .attr("height", 10)
    .attr("fill", "red")
    .attr("stroke-width", 2);

  g.append("text")
    .text("Negative Sentiment")
    .attr("text-anchor", "start")
    .attr("x", 335)
    .attr("y", -77)
    .style("font-size", "12px")
    .attr("fill", "blue");

  if (dateRange) {
    g.append("text")
      .text(
        `${dateRange[0].toISOString().slice(0, 10)} - ${dateRange[1]
          .toISOString()
          .slice(0, 10)}`
      )
      .attr("text-anchor", "start")
      .attr("x", 675)
      .attr("y", -57)
      .style("font-size", "12px")
      .attr("fill", "blue");
  }

  const setUpChart = () => {
    // determine domain
    if(data) {
      const maxNegative = Math.max(...sentimentData.negative);
      const maxPositive = Math.max(...sentimentData.positive);
      const maxNeutral = Math.max(...sentimentData.neutral);
      const max = Math.max(maxNegative, maxPositive, maxNeutral);
      y.domain([0, max]);
      const yAxisCall = d3.axisLeft(y).ticks(6);
      g.append("g").attr("class", "y axis").call(yAxisCall.scale(y));
    }
    x.domain([0, 99]);

    const xAxisCall = d3.axisBottom(x)
    g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${HEIGHT})`)
    .call(xAxisCall.scale(x));
    // X axis
    g.append("g")
      .attr("transform", `translate(0, ${HEIGHT})`)
      .attr("class", "x-axis");

    // Y axis
    g.append("g").attr("class", "y-axis");

    // X axis label
    g.append("text")
      .attr("class", "x axis-label")
      .attr("x", WIDTH / 2)
      .attr("y", HEIGHT + 60)
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
      .text("Sentiment Score")
      .style("fill", "blue");

    // Y axis label
    g.append("text")
      .attr("class", "y axis-label")
      .attr("x", -(HEIGHT / 2))
      .attr("y", -60)
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text("Frequency of Sentiment")
      .style("fill", "blue");
  }

  // Generate the chart
  useEffect(() => {
    setUpChart();
  }, [sentimentData]);

  if (!data) return <p>Loading...</p>;

  console.log(sentimentData);
  console.log(totalTweets)
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
