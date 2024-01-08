import React, { use, useEffect, useState } from "react";
import * as d3 from "d3";
import { TweetData } from "../types/TweetData";
import IParams from "@/types/Params";

interface TopAccountsProps {
  params: IParams;
}

interface TweetDataByUser {
  numTweets: number;
  avgNegSentiment: number;
  tweets: TweetData[];
}

interface TopAccounts {
  user: string;
  numTweets: number;
  avgNegSentiment: number;
  tweets: TweetData[];
}

const TopAccounts = ({ params }: TopAccountsProps) => {
  const [data, setData] = useState<TweetData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [tweetsByUser, setTweetsByUser] = useState<{
    [key: string]: TweetDataByUser;
  }>({});
  const [tweetsByUserWithSentiment, setTweetsByUserWithSentiment] = useState<{
    [key: string]: TweetDataByUser;
  }>({});
  const [topAccounts, setTopAccounts] = useState<TopAccounts[]>([]);

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

  useEffect(() => {
    if (data.length === 0) return;
    const tweetsByUserData: { [key: string]: TweetDataByUser } = {};

    data.forEach((tweet) => {
      if (tweetsByUserData[tweet.user]) {
        tweetsByUserData[tweet.user].numTweets++;
        tweetsByUserData[tweet.user].tweets.push(tweet);
      } else {
        tweetsByUserData[tweet.user] = {
          numTweets: 1,
          avgNegSentiment: 0,
          tweets: [tweet],
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

  console.log(topAccounts);
  return (
    <div>
      <h1>Shit on my dick</h1>
    </div>
  );
};

export default TopAccounts;
