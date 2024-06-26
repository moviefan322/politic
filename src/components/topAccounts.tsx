import React, { use, useEffect, useState } from "react";
import * as d3 from "d3";
import { TweetData } from "../types/TweetData";
import IParams from "@/types/Params";
import ILoading from "@/types/ILoading";
import styles from "./topAccounts.module.css";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";

interface TopAccountsProps {
  params: IParams;
  loading: ILoading;
  setLoading: React.Dispatch<React.SetStateAction<ILoading>>;
}

interface TweetDataByUser {
  numTweets: number;
  avgNegSentiment: number;
  totalLikes: number;
  totalViews: number;
  tweets: TweetData[];
}

interface TopAccounts {
  user: string;
  numTweets: number;
  avgNegSentiment: number;
  totalLikes: number;
  totalViews: number;
  tweets: TweetData[];
}

const TopAccounts = ({ params, loading, setLoading }: TopAccountsProps) => {
  const [data, setData] = useState<TweetData[]>([]);
  const [error, setError] = useState<string>("");
  const [tweetsByUser, setTweetsByUser] = useState<{
    [key: string]: TweetDataByUser;
  }>({});
  const [tweetsByUserWithSentiment, setTweetsByUserWithSentiment] = useState<{
    [key: string]: TweetDataByUser;
  }>({});
  const [topAccounts, setTopAccounts] = useState<TopAccounts[]>([]);

  // Load and organize data
  useEffect(() => {
    setLoading({ ...loading, topAccounts: true });
    d3.csv(`data2/${params.candidate}_${params.platform}_data.csv`)
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
      .finally(() => {
        setLoading({ ...loading, topAccounts: false });
      });
  }, [params]);

  useEffect(() => {
    if (data.length === 0) return;
    const tweetsByUserData: { [key: string]: TweetDataByUser } = {};

    data.forEach((tweet) => {
      if (tweetsByUserData[tweet.user]) {
        tweetsByUserData[tweet.user].numTweets++;
        tweetsByUserData[tweet.user].tweets.push(tweet);
        tweetsByUserData[tweet.user].totalLikes += tweet.likes;
        tweetsByUserData[tweet.user].totalViews += tweet.views;
      } else {
        tweetsByUserData[tweet.user] = {
          numTweets: 1,
          avgNegSentiment: 0,
          tweets: [tweet],
          totalLikes: tweet.likes,
          totalViews: tweet.views,
        };
      }
    });

    setTweetsByUser(tweetsByUserData);
  }, [data]);

  useEffect(() => {
    if (Object.keys(tweetsByUser).length === 0) return;
    // Calculate average negative sentiment for each user
    const tweetsByUserData = { ...tweetsByUser };

    Object.keys(tweetsByUserData).forEach((user) => {
      const totalNegSentiment = tweetsByUserData[user].tweets.reduce(
        (acc, tweet) => acc + tweet.negativeSentiment,
        0
      );

      tweetsByUserData[user].avgNegSentiment = (
        totalNegSentiment / tweetsByUserData[user].numTweets
      ).toFixed(2) as unknown as number;
    });

    setTweetsByUserWithSentiment(tweetsByUserData);
  }, [tweetsByUser]);

  // Sort by number of posts, put top 10 in topAccounts
  useEffect(() => {
    if (Object.keys(tweetsByUserWithSentiment).length === 0) return;
    const sortedTweetsByUser = Object.keys(tweetsByUserWithSentiment)
      .map((user) => ({
        user,
        ...tweetsByUserWithSentiment[user],
      }))
      .sort((a, b) => b.numTweets - a.numTweets);

    setTopAccounts(sortedTweetsByUser.slice(0, 10));
  }, [tweetsByUserWithSentiment]);

  if (error) return;

  return (
    <>
      <div
        className={`py-5 d-flex flex-column align-items-center justify-content-center chart ${styles.topAccounts}`}
      >
        <div className="w-100 row mb-5">
          <p className="fw-bold text-secondary fs-4 col-6 ms-3">
            Top 10 Accounts for Negative Posts
          </p>
          <div className={`${styles.socials}`}>
            <FaFacebookF style={{ width: "30px", height: "30px" }} />
            <FaTwitter
              className={styles.twitter}
              style={{ width: "30px", height: "30px" }}
            />
            <FaInstagram style={{ width: "30px", height: "30px" }} />
            <FaYoutube style={{ width: "30px", height: "30px" }} />
          </div>
        </div>

        <div className={styles.chart}>
          <div className="row w-100 text-center text-secondary d-flex justify-content-center">
            <div className={`col-3 offset-1 m-1 ${styles.headerContainer}`}>
              <div className={`${styles.headerBox}`}>
                <h6>Account Name</h6>
              </div>
              {topAccounts.map((account, i) => (
                <div key={i}>
                  <p className={`${styles.item}`}>{account.user}</p>
                </div>
              ))}
            </div>
            <div className={`col-2 offset-1 m-1 ${styles.headerContainer}`}>
              <div className={`${styles.headerBox}`}>
                <h6># of Tweets</h6>
              </div>
              {topAccounts.map((account, i) => (
                <div key={i}>
                  <p className={styles.item}>{account.numTweets}</p>
                </div>
              ))}
            </div>
            <div className={`col-2 offset-1 m-1 ${styles.headerContainer}`}>
              <div className={`${styles.headerBox}`}>
                <h6>Total Likes</h6>
              </div>
              {topAccounts.map((account, i) => (
                <div key={i}>
                  <p className={styles.item}>{account.totalLikes}</p>
                </div>
              ))}
            </div>
            <div className={`col-2 offset-1 m-1 ${styles.headerContainer}`}>
              <div className={`${styles.headerBox}`}>
                <h6>Total Views</h6>
              </div>
              {topAccounts.map((account, i) => (
                <div key={i}>
                  <p className={styles.item}>{account.totalViews}</p>
                </div>
              ))}
            </div>
            <div className={`col-2 offset-1 m-1 ${styles.headerContainer}`}>
              <div className={`${styles.headerBox}`}>
                <h6>Avg Sentiment</h6>
              </div>
              {topAccounts.map((account, i) => (
                <div key={i}>
                  <p className={styles.item}>{account.avgNegSentiment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopAccounts;
