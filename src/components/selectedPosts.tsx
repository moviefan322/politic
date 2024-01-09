import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import { TweetData } from "../types/TweetData";
import IParams from "@/types/Params";
import styles from "./selectedPosts.module.css";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import Loading from "./loading";
import { TweetsByDate } from "../types/TweetData";

interface SelectedPostsProps {
  params: IParams;
}

const SelectedPosts = ({ params }: SelectedPostsProps) => {
  const [data, setData] = useState<TweetData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [negativeTweets, setNegativeTweets] = useState<TweetsByDate>({});
  const [likedTweets, setLikedTweets] = useState<TweetsByDate>({});
  const [likedNegativeTweets, setLikedNegativeTweets] = useState<TweetsByDate>(
    {}
  );
  const [allTweets, setAllTweets] = useState<TweetsByDate>({});
  const [selectedTweets, setSelectedTweets] = useState<TweetData[]>([]);

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // Use 24-hour format
    };

    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      date
    );
    return formattedDate.replace(
      /(\d+)\/(\d+)\/(\d+), (\d+:\d+:\d+)/,
      "$3/$1/$2 $4"
    );
  };

  useEffect(() => {
    setLoading(true);
    d3.csv(`data/${params.candidate}_${params.platform}_data.csv`).then((d) => {
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
      setLoading(false);
    });
  }, [params]);

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

        if (
          tweet.negativeSentiment > params.negTweetCutoff &&
          tweet.likes > 0
        ) {
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
        } else if (tweet.negativeSentiment > params.negTweetCutoff) {
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
  }, [data, params]);

  useEffect(() => {
    if (Object.keys(negativeTweets).length === 0) return;
    // Create array of most 10 most recent negative tweets
    const negativeTweetsArray = Object.values(negativeTweets).sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );

    console.log(negativeTweetsArray[0].tweets.slice(0, 10));
    setSelectedTweets(negativeTweetsArray[0].tweets.slice(0, 10));
  }, [negativeTweets]);

  console.log(negativeTweets);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div
        className={`py-5 w-75 d-flex flex-column align-items-center justify-content-center chart`}
      >
        <div className="w-100 row mb-5">
          <p className="fw-bold text-secondary fs-2 col-5 ms-3">
            Individual Posts
          </p>
          <div className={`col-3 offset-2 ${styles.socials}`}>
            <FaFacebookF style={{ width: "50px", height: "50px" }} />
            <FaTwitter
              className={styles.twitter}
              style={{ width: "50px", height: "50px" }}
            />
            <FaInstagram style={{ width: "50px", height: "50px" }} />
            <FaYoutube style={{ width: "50px", height: "50px" }} />
          </div>
        </div>

        <div className={styles.chart}>
          <div className="row w-100 text-center text-secondary d-flex justify-content-center">
            <div className={`col-1 m-1 ${styles.headerContainer}`}>
              <div className={`${styles.header}`}>
                <p className="fs-5">Date/Time</p>
              </div>
              {selectedTweets.map((tweet, i) => (
                <div
                  className="col-12 bg-white border border-1 border-secondary"
                  key={i}
                >
                  <p className={`${styles.user}`} style={{ width: "100%" }}>
                    {formatDate(tweet.date)}
                  </p>
                </div>
              ))}
            </div>
            <div className={`col-1 m-1 ${styles.headerContainer}`}>
              <div className={`${styles.header}`}>
                <p className="fs-5">URL</p>
              </div>
              {selectedTweets.map((tweet, i) => (
                <div
                  className="col-12 bg-white border border-1 border-secondary"
                  key={i}
                >
                  <p className={styles.item} style={{ width: "100%" }}>
                    {tweet.url}
                  </p>
                </div>
              ))}
            </div>
            <div className={`col-1 m-1 ${styles.headerContainer}`}>
              <div className={`${styles.header}`}>
                <p className="fs-5">Post Content</p>
              </div>
              {selectedTweets.map((tweet, i) => (
                <div
                  className="col-12 bg-white border border-1 border-secondary"
                  key={i}
                >
                  <p className={styles.item}>{tweet.content}</p>
                </div>
              ))}
            </div>
            <div className={`col-1 m-1 ${styles.headerContainer}`}>
              <div className={`${styles.header}`}>
                <p className="fs-5">Postive Sentiment</p>
              </div>
              {selectedTweets.map((tweet, i) => (
                <div
                  className="col-12 bg-white border border-1 border-secondary"
                  key={i}
                >
                  <p className={styles.item} style={{ width: "100%" }}>
                    {tweet.positiveSentiment.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className={`col-1 m-1 ${styles.headerContainer}`}>
              <div className={`${styles.header}`}>
                <p className="fs-5">Netural Sentiment</p>
              </div>
              {selectedTweets.map((tweet, i) => (
                <div
                  className="col-12 bg-white border border-1 border-secondary"
                  key={i}
                >
                  <p className={styles.item} style={{ width: "100%" }}>
                    {tweet.neutralSentiment.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className={`col-1 m-1 ${styles.headerContainer}`}>
              <div className={`${styles.header}`}>
                <p className="fs-5">Negative Sentiment</p>
              </div>
              {selectedTweets.map((tweet, i) => (
                <div
                  className="col-12 bg-white border border-1 border-secondary"
                  key={i}
                >
                  <p className={styles.item} style={{ width: "100%" }}>
                    {tweet.negativeSentiment.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className={`col-1 m-1 ${styles.headerContainer}`}>
              <div className={`${styles.header}`}>
                <p className="fs-5">Total Views</p>
              </div>
              {selectedTweets.map((tweet, i) => (
                <div
                  className="col-12 bg-white border border-1 border-secondary"
                  key={i}
                >
                  <p className={styles.item} style={{ width: "100%" }}>
                    {tweet.views}
                  </p>
                </div>
              ))}
            </div>
            <div className={`col-1 m-1 ${styles.headerContainer}`}>
              <div className={`${styles.header}`}>
                <p className="fs-5">Total Likes</p>
              </div>
              {selectedTweets.map((tweet, i) => (
                <div
                  className="col-12 bg-white border border-1 border-secondary"
                  key={i}
                >
                  <p className={styles.item} style={{ width: "100%" }}>
                    {tweet.likes}
                  </p>
                </div>
              ))}
            </div>
            <div className={`col-1 m-1 ${styles.headerContainer}`}>
              <div className={`${styles.header}`}>
                <p className="fs-5">Total Re-Posts</p>
              </div>
              {selectedTweets.map((tweet, i) => (
                <div
                  className="col-12 bg-white border border-1 border-secondary"
                  key={i}
                >
                  <p className={styles.item} style={{ width: "100%" }}>
                    {tweet.retweets}
                  </p>
                </div>
              ))}
            </div>
            <div className={`col-1 m-1 ${styles.headerContainer}`}>
              <div className={`${styles.header}`}>
                <p className="fs-5">Total Replies</p>
              </div>
              {selectedTweets.map((tweet, i) => (
                <div
                  className="col-12 bg-white border border-1 border-secondary"
                  key={i}
                >
                  <p className={styles.item} style={{ width: "100%" }}>
                    {tweet.replies}
                  </p>
                </div>
              ))}
            </div>
            <div className={`col-1 m-1 ${styles.headerContainer}`}>
              <div className={`${styles.header}`}>
                <p className="fs-5">Mentioned Users</p>
              </div>
              {selectedTweets.map((tweet, i) => (
                <div
                  className="col-12 bg-white border border-1 border-secondary"
                  key={i}
                >
                  <p className={styles.item} style={{ width: "100%" }}>
                    {tweet.mentionedUsers}
                  </p>
                </div>
              ))}
            </div>
            <div className={`col-1 m-1 ${styles.headerContainer}`}>
              <div className={`${styles.header}`}>
                <p className="fs-5">Account Name</p>
              </div>
              {selectedTweets.map((tweet, i) => (
                <div
                  className="col-12 bg-white border border-1 border-secondary"
                  key={i}
                >
                  <p className={styles.item} style={{ width: "100%" }}>
                    {tweet.user}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectedPosts;
