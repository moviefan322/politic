import { useState, useEffect } from "react";
import Loading from "@/components/loading";
import runChatGPT from "@/utils/runChatGpt";
import { TweetData } from "@/types/TweetData";
import styles from "@/components/response.module.css";

interface ResponseProps {
  tweet: TweetData;
}

const Response = ({ tweet }: ResponseProps) => {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [formattedResponse, setFormattedResponse] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    runChatGPT(
      `Write 10 tweets positively responding to this: ${tweet.content}`
    )
      .then((result) => {
        setResponse(result.split(/(?=\d\.)/));
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [tweet]);

  useEffect(() => {
    if (response) {
      const cleanResponse: string[] = [];
      for (let tweet of response) {
        cleanResponse.push(tweet.slice(3));
      }
      setFormattedResponse(cleanResponse);
      setLoading(false);
    }
  }, [response]);

  if (loading) {
    return <Loading />;
  }

  if (response.length > 0) {
    return (
      <div
        className={`d-flex flex-column justify-content-center ${styles.response}`}
      >
        {tweet && (
          <div className={`row ${styles.metadata}`}>
            <div className="col-12">
              <div>
                <h6>Post Metadata:</h6>
              </div>
              <div className="d-flex flex-row">
                <h6 className="ms-5 col-2">Account Name: {tweet.user}</h6>
                <h6 className="ms-5 col-6">Post Content: {tweet.content}</h6>
                <button className={`col-1 offset-1 ${styles.butt}`}>
                  Modify
                </button>
              </div>
              <div className={styles.borderLine}></div>
            </div>
          </div>
        )}

        {formattedResponse.length > 0 && (
          <>
            {formattedResponse.map((tweet, i) => (
              <div key={i} className={`chart w-100 ${styles.chart}`}>
                <h5>Response #{i + 1}</h5>
                <p>{tweet.replace(/"/g, "")}</p>
              </div>
            ))}
          </>
        )}
      </div>
    );
  }
};

export default Response;
