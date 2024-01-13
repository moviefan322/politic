import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import styles from "./lineChart.module.css";

interface TweetData {
  content: string;
  externalLinkContent: string[];
  externalLinks: string[];
  likes: number;
  mentionedUsers: string[];
  negativeSentiment: number;
  neutralSentiment: number;
  positiveSentiment: number;
  quoteTweets: number;
  replies: number;
  retweets: number;
  translatedContent: string;
  tweetID: string;
  url: string;
  user: string;
  verifiedStatus: string;
  views: number;
  date: Date;
  media: string;
}

interface TweetsByDate {
  [key: string]: {
    date: Date;
    tweets: TweetData[];
    count: number;
  };
}

interface LineFunction {
  (data: { date: Date; count: number }[]): string | null;
}

const Debug = () => {
  const [data, setData] = useState<TweetData[]>();
  const [negativeTweets, setNegativeTweets] = useState<TweetsByDate>();
  const [likedTweets, setLikedTweets] = useState<TweetsByDate>();
  const [likedNegativeTweets, setLikedNegativeTweets] =
    useState<TweetsByDate>();
  const [allTweets, setAllTweets] = useState<TweetsByDate>();
  const svgRef = useRef<SVGSVGElement>(null);
  const svgWidth = 800;
  const svgHeight = 600;

  // Load and organize data
  useEffect(() => {
    d3.csv("data2/d_k_shivakumar_twitter_data.csv").then((d) => {
      console.log(d);
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


  // Organize data by date and sentiment
  useEffect(() => {
    if (data) {
      const negativeTweetsByDate: TweetsByDate = {};
      const likedTweetsByDate: TweetsByDate = {};
      const likedNegativeTweetsByDate: TweetsByDate = {};
      const allTweetsByDate: TweetsByDate = {};

      data.forEach((tweet) => {
        const tweetDate = tweet.date.toISOString().slice(0, 10);
        if (!allTweetsByDate[tweetDate]) {
          allTweetsByDate[tweetDate] = {
            date: new Date(tweetDate),
            tweets: [],
            count: 0,
          };
        }
        allTweetsByDate[tweetDate].tweets.push(tweet);
        allTweetsByDate[tweetDate].count =
          allTweetsByDate[tweetDate].tweets.length;

        if (tweet.negativeSentiment > 62 && tweet.likes > 0) {
          if (!likedNegativeTweetsByDate[tweetDate]) {
            likedNegativeTweetsByDate[tweetDate] = {
              date: new Date(tweetDate),
              tweets: [],
              count: 0,
            };
          }
          likedNegativeTweetsByDate[tweetDate].tweets.push(tweet);
          likedNegativeTweetsByDate[tweetDate].count =
            likedNegativeTweetsByDate[tweetDate].tweets.length;
        } else if (tweet.negativeSentiment > 62) {
          const tweetDate = tweet.date.toISOString().slice(0, 10);
          if (!negativeTweetsByDate[tweetDate]) {
            negativeTweetsByDate[tweetDate] = {
              date: new Date(tweetDate),
              tweets: [],
              count: 0,
            };
          }
          negativeTweetsByDate[tweetDate].tweets.push(tweet);
          negativeTweetsByDate[tweetDate].count =
            negativeTweetsByDate[tweetDate].tweets.length;
        } else if (tweet.likes > 0) {
          const tweetDate = tweet.date.toISOString().slice(0, 10);
          if (!likedTweetsByDate[tweetDate]) {
            likedTweetsByDate[tweetDate] = {
              date: new Date(tweetDate),
              tweets: [],
              count: 0,
            };
          }
          likedTweetsByDate[tweetDate].tweets.push(tweet);
          likedTweetsByDate[tweetDate].count =
            likedTweetsByDate[tweetDate].tweets.length;
        }
      });

      setNegativeTweets(negativeTweetsByDate);
      setLikedTweets(likedTweetsByDate);
      setLikedNegativeTweets(likedNegativeTweetsByDate);
      setAllTweets(allTweetsByDate);
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

  const x = d3.scaleTime().range([0, WIDTH]);
  const y = d3.scaleLinear().range([HEIGHT, 0]);

  g.append("text")
    .text("Post Analysis")
    .attr("text-anchor", "start")
    .attr("x", -35)
    .attr("y", -50)
    .style("font-size", "25px")
    .attr("fill", "blue");

  g.append("line")
    .attr("x1", 160)
    .attr("y1", -80)
    .attr("x2", 190)
    .attr("y2", -80)
    .attr("stroke", "black")
    .attr("stroke-width", 2);

  g.append("text")
    .text("Total Posts")
    .attr("text-anchor", "start")
    .attr("x", 195)
    .attr("y", -77)
    .style("font-size", "12px")
    .attr("fill", "blue");

  g.append("line")
    .attr("x1", 160)
    .attr("y1", -60)
    .attr("x2", 190)
    .attr("y2", -60)
    .attr("stroke", "red")
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", "8,8");

  g.append("text")
    .text("Negative Posts")
    .attr("text-anchor", "start")
    .attr("x", 195)
    .attr("y", -57)
    .style("font-size", "12px")
    .attr("fill", "blue");

  g.append("line")
    .attr("x1", 290)
    .attr("y1", -80)
    .attr("x2", 320)
    .attr("y2", -80)
    .attr("stroke", "green")
    .attr("stroke-dasharray", "5,5")
    .attr("stroke-width", 2);

  g.append("text")
    .text("Liked Posts")
    .attr("text-anchor", "start")
    .attr("x", 325)
    .attr("y", -77)
    .style("font-size", "12px")
    .attr("fill", "blue");

  g.append("line")
    .attr("x1", 290)
    .attr("y1", -60)
    .attr("x2", 320)
    .attr("y2", -60)
    .attr("stroke", "blue")
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", "3,3");

  g.append("text")
    .text("Negative Liked Posts")
    .attr("text-anchor", "start")
    .attr("x", 325)
    .attr("y", -57)
    .style("font-size", "12px")
    .attr("fill", "blue");

  // Set up the chart
  const setUpChart = () => {
    if (data) {
      const maxCount =
        d3.max(Object.values(allTweets || {}), (d) => d.count) || 0;
      const maxY = Math.max(maxCount);
      x.domain(d3.extent(data!, (d) => d.date) as unknown as Date[]);
      y.domain([0, maxY]);
    }

    const xAxisCall = d3.axisBottom(x);
    const yAxisCall = d3.axisLeft(y).ticks(6);
    g.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${HEIGHT})`)
      .call(xAxisCall.scale(x));

    g.append("g").attr("class", "y axis").call(yAxisCall.scale(y));

    g.append("text")
      .attr("class", "y axis-label")
      .attr("x", -(HEIGHT / 2))
      .attr("y", -40)
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text("# of tweets");
  };

  const drawLineChart = (
    data: { date: Date; count: number }[],
    color: string,
    dashed: string
  ) => {
    const line = d3
      .line<{ date: Date; count: number }>()
      .x((d) => x(d.date) ?? 0)
      .y((d) => y(d.count) ?? 0);

    const drawLine = (line: LineFunction, dash: string) => {
      g.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", `${color}`)
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", dashed)
        .attr("d", line);
    };

    drawLine(line, dashed);
  };

  // Draw the lines
  useEffect(() => {
    const drawLine = (data: TweetsByDate, color: string, dashed: string) => {
      if (data && Object.keys(data).length > 0) {
        const values = Object.values(data);

        const chartData = values.reduce((acc, entry) => {
          return acc.concat(
            entry.tweets.map((tweet) => ({
              date: tweet.date,
              count: entry.count,
            }))
          );
        }, [] as { date: Date; count: number }[]);

        chartData.sort((a, b) => a.date.getTime() - b.date.getTime());

        // Create an object to store unique dates and counts
        const uniqueChartData: {
          [key: string]: { date: Date; count: number };
        } = {};

        chartData.forEach((entry) => {
          const dateString = entry.date.toISOString().slice(0, 10);
          uniqueChartData[dateString] = {
            date: entry.date,
            count: entry.count,
          };
        });

        // Convert the object values back to an array
        const uniqueChartDataArray = Object.values(uniqueChartData);

        drawLineChart(uniqueChartDataArray, color, dashed);

        console.log(uniqueChartData);
      }
    };
    setUpChart();
    drawLine(allTweets!, "black", "none");
    drawLine(likedNegativeTweets!, "blue", "3, 3");
    drawLine(likedTweets!, "green", "5, 5");
    drawLine(negativeTweets!, "red", "8,8");
  }, [likedTweets, negativeTweets, likedNegativeTweets, allTweets]);

  if (!data) {
    return <div>Loading...</div>;
  }

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

export default Debug;
