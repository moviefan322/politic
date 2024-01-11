import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import { TweetData } from "../types/TweetData";
import IParams from "@/types/Params";
import styles from "./selectedPosts.module.css";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaChevronCircleLeft } from "react-icons/fa";
import { FaChevronCircleRight } from "react-icons/fa";
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
  const [showPage1, setShowPage1] = useState<boolean>(true);

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
              mentionedUsers:
                tweet["Mentioned Users"] !== "[]"
                  ? [tweet["Mentioned Users"]]
                  : ["n/a"],

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

  console.log(selectedTweets);

  return (
    <>
      <div
        className={`py-5 w-75 d-flex flex-column align-items-center justify-content-center ${styles.container}`}
      >
        <div className={`w-100 row mb-5 ${styles.chartHead}`}>
          <p className="fw-bold text-secondary fs-2 col-5 ms-5">
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
          <div className="col-1 d-flex flex-direction-row">
            <button
              className={`btn btn-outline-secondary ${styles.pageButton}`}
              onClick={() => setShowPage1(true)}
              disabled={showPage1}
            >
              <FaChevronCircleLeft />
            </button>
            <button
              className={`btn btn-outline-secondary ${styles.pageButton}`}
              onClick={() => setShowPage1(false)}
              disabled={!showPage1}
            >
              <FaChevronCircleRight />
            </button>
          </div>
        </div>

        <div className={`${styles.chart}`}>
          {showPage1 ? (
            <div className="row d-flex ">
              <div className={`${styles.buttGroup} col-1`}>
                <div className={`${styles.headerBox} ${styles.filler} `}></div>
                {selectedTweets.map((tweet, i) => (
                  <div key={i} className={`${styles.buttonsDiv}`}>
                    <button className={styles.butt}>Reply</button>
                  </div>
                ))}
              </div>

              <div className="col-1">
                <div className={`${styles.headerBox}`}>
                  <h6>
                    Date/
                    <br />
                    Time
                  </h6>
                </div>
                {selectedTweets.map((tweet, i) => (
                  <div key={i} className={`${styles.box}`}>
                    {formatDate(tweet.date)}
                  </div>
                ))}
              </div>

              <div className="col-2">
                <div className={`${styles.headerBox}`}>
                  <h6>URL</h6>
                </div>
                {selectedTweets.map((tweet, i) => (
                  <div key={i} className={`${styles.box} ${styles.url}`}>
                    {tweet.url}
                  </div>
                ))}
              </div>
              <div className="col-2">
                <div className={`${styles.headerBox}`}>
                  <h6>Post Content</h6>
                </div>
                {selectedTweets.map((tweet, i) => (
                  <div key={i} className={`${styles.box} ${styles.content}`}>
                    <p> </p>
                    <p> </p>
                    {tweet.content}
                  </div>
                ))}
              </div>
              <div className="col-2">
                <div className={`${styles.headerBox}`}>
                  <h6>Positive Sentiment</h6>
                </div>
                {selectedTweets.map((tweet, i) => (
                  <div key={i} className={`${styles.box}`}>
                    {tweet.positiveSentiment.toFixed(2)}
                  </div>
                ))}
              </div>
              <div className="col-2">
                <div className={`${styles.headerBox}`}>
                  <h6>Netural Sentiment</h6>
                </div>
                {selectedTweets.map((tweet, i) => (
                  <div key={i} className={`${styles.box}`}>
                    {tweet.neutralSentiment.toFixed(2)}
                  </div>
                ))}
              </div>
              <div className="col-2">
                <div className={`${styles.headerBox}`}>
                  <h6>Negative Sentiment</h6>
                </div>
                {selectedTweets.map((tweet, i) => (
                  <div key={i} className={`${styles.box}`}>
                    {tweet.negativeSentiment.toFixed(2)}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <h1>Page 2</h1>
          )}

          {/*  Start of Page 2 */}

          {/* <div className="row">
              <div className={styles.buttGroup}>
                <div className={styles.filler}></div>
                {selectedTweets.map((tweet, i) => (
                  <div key={i} className={`${styles.buttonsDiv}`}>
                    <button className={styles.butt}>Reply</button>
                  </div>
                ))}
              </div>
              <div className="col">
                <div className={`${styles.headerBox3}`}>
                  <h6>Total Views</h6>
                </div>
                {selectedTweets.map((tweet, i) => (
                  <div key={i} className={`${styles.box3}`}>
                    {tweet.views}
                  </div>
                ))}
              </div>
              <div className="col">
                <div className={`${styles.headerBox3}`}>
                  <h6>Total Likes</h6>
                </div>
                {selectedTweets.map((tweet, i) => (
                  <div key={i} className={`${styles.box3}`}>
                    {tweet.likes}
                  </div>
                ))}
              </div>
              <div className="col">
                <div className={`${styles.headerBox3}`}>
                  <h6>Total Re-Posts</h6>
                </div>
                {selectedTweets.map((tweet, i) => (
                  <div key={i} className={`${styles.box3}`}>
                    {tweet.retweets}
                  </div>
                ))}
              </div>
              <div className="col">
                <div className={`${styles.headerBox3}`}>
                  <h6>Total Replies</h6>
                </div>
                {selectedTweets.map((tweet, i) => (
                  <div key={i} className={`${styles.box3}`}>
                    {tweet.replies}
                  </div>
                ))}
              </div>
              <div className="col">
                <div className={`${styles.headerBox3}`}>
                  <h6>Mentioned Users</h6>
                </div>
                {selectedTweets.map((tweet, i) => (
                  <div key={i} className={`${styles.box3}`}>
                    {tweet.mentionedUsers}
                  </div>
                ))}
              </div>
              <div className="col">
                <div className={`${styles.headerBox3}`}>
                  <h6>Account Name</h6>
                </div>
                {selectedTweets.map((tweet, i) => (
                  <div key={i} className={`${styles.box3}`}>
                    {tweet.user}
                  </div>
                ))}
              </div>
            </div> */}
        </div>
      </div>
    </>
  );
};

export default SelectedPosts;
