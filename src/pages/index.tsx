import React, { use, useEffect, useState } from "react";
import * as d3 from "d3";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import styles from "@/pages/index.module.css";
import Params from "@/components/params";
import LineChart from "@/components/lineChart";
import HistogramChart from "@/components/histogram";
import TopAccounts from "@/components/topAccounts";
import SelectedPosts from "@/components/selectedPosts";
import Loading from "@/components/loading";
import Error from "@/components/error";
import IParams from "@/types/Params";
import ILoading from "../types/ILoading";
import { TweetData } from "@/types/TweetData";

const Index = () => {
  const [chartWidth, setChartWidth] = useState<number>(0);
  const [data, setData] = useState<TweetData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<ILoading>({
    lineChart: false,
    histogram: false,
    topAccounts: false,
    selectedPosts: false,
  });

  const [params, setParams] = useState<IParams>({
    country: "United States",
    candidate: "",
    platform: "",
    keywords: [],
    negTweetCutoff: 50,
    posTweetCutoff: 50,
    dateRange: null,
    showChart: false,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setChartWidth(window.innerWidth * 0.75);
    }
  }, []);

  // Fetch data/check for errors
  useEffect(() => {
    if (!params.showChart) return;
    d3.csv(`data/${params.candidate}_${params.platform}_data.csv`)
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

        setData(modifiedData);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
  }, [params]);

  return (
    <>
      {(loading.lineChart ||
        loading.histogram ||
        loading.topAccounts ||
        loading.selectedPosts) && <Loading />}
      <div className={styles.top}>
        <div className={styles.nav}>
          <Navbar />
          <Sidebar />
        </div>
        <Params setParams={setParams} params={params} setError={setError} />
      </div>
      {/* {params.showChart && <hr className="mt-5"/>} */}
      <div
        className={`my-5 mb-5 ${styles.analysis}`}
        style={params.showChart ? { borderTop: "1px solid gray" } : {}}
      >
        {error && <Error error={error} />}
        {params.showChart && !error && (
          <div className={styles.candidates}>
            <>
              <LineChart
                params={params}
                setLoading={setLoading}
                loading={loading}
                chartWidth={chartWidth}
              />
              <HistogramChart
                params={params}
                setLoading={setLoading}
                loading={loading}
                chartWidth={chartWidth}
              />
              <TopAccounts
                params={params}
                setLoading={setLoading}
                loading={loading}
              />
              <SelectedPosts
                params={params}
                setLoading={setLoading}
                loading={loading}
              />
            </>
          </div>
        )}
        <div className={styles.filler}></div>
      </div>
    </>
  );
};

export default Index;
