import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { all } from "axios";

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

const Candidates = () => {
  const [data, setData] = useState<TweetData[]>();
  const [negativeTweets, setNegativeTweets] = useState<TweetsByDate>();
  const [likedTweets, setLikedTweets] = useState<TweetsByDate>();
  const [likedNegativeTweets, setLikedNegativeTweets] =
    useState<TweetsByDate>();
  const [allTweets, setAllTweets] = useState<TweetsByDate>();
  const svgRef = useRef<SVGSVGElement>(null);
  const svgWidth = 800;
  const svgHeight = 600;

  useEffect(() => {
    d3.csv("data/eric_adams_twitter_data.csv").then((d) => {
      const modifiedData: TweetData[] = d.map((tweet) => ({
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
        date: new Date(Date.parse(tweet.date)),
        media: tweet.media,
      }));

      setData(modifiedData);
    });
  }, []);

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

  const svg = d3.select(svgRef.current);

  const MARGIN = { LEFT: 80, RIGHT: 20, TOP: 50, BOTTOM: 100 };
  const WIDTH = svgWidth - MARGIN.LEFT - MARGIN.RIGHT;
  const HEIGHT = svgHeight - MARGIN.TOP - MARGIN.BOTTOM;

  const g = svg
    .append("g")
    .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

  const x = d3.scaleTime().range([0, WIDTH]);
  const y = d3.scaleLinear().range([HEIGHT, 0]);

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
    color: string
  ) => {
    const negativeTweetLine = d3
      .line<{ date: Date; count: number }>()
      .x((d) => x(d.date) ?? 0)
      .y((d) => y(d.count) ?? 0);

    const likedTweetLine = d3
      .line<{ date: Date; count: number }>()
      .x((d) => x(d.date) ?? 0)
      .y((d) => y(d.count) ?? 0);

    console.log(typeof negativeTweetLine);

    const drawLine = (line: LineFunction) => {
      g.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", `${color}`)
        .attr("stroke-width", 2)
        .attr("d", line);
    };

    drawLine(negativeTweetLine);
    drawLine(likedTweetLine);
  };

  useEffect(() => {
    const drawLine = (data: TweetsByDate, color: string) => {
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

        drawLineChart(uniqueChartDataArray, color);

        console.log(uniqueChartData);
      }
    };
    setUpChart();
    drawLine(allTweets!, "black");
    drawLine(likedNegativeTweets!, "blue");
    drawLine(likedTweets!, "green");
    drawLine(negativeTweets!, "red");
  }, [likedTweets, negativeTweets, likedNegativeTweets, allTweets]);

  if (!data) {
    return <div>Loading...</div>;
  }

  console.log(allTweets);

  return (
    <div>
      <svg ref={svgRef} width={svgWidth} height={svgHeight}></svg>
    </div>
  );
};

export default Candidates;
