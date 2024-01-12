import { useState, useEffect } from "react";
import runChatGPT from "@/utils/runChatGpt";

const Test = () => {
  const [response, setResponse] = useState("");
  const [formattedResponse, setFormattedResponse] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    runChatGPT(
      "Write 10 tweets positively responding to this: 'Eric Adams is the worst mayor of all time, he's a racist and a bigot and hates black people'"
    )
      .then((result) => {
        setResponse(result.split("\n\n"));
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  useEffect(() => {
    if (response) {
      const cleanResponse: string[] = [];
      for (let tweet of response) {
        cleanResponse.push(tweet.slice(3));
      }
      setFormattedResponse(cleanResponse);
    }
  }, [response]);

  if (response.length > 0) {

    return (
      <div>
        {formattedResponse.length > 0 && (
          <div>
            {formattedResponse.map((tweet, i) => (
              <>
                <div key={i}>
                  <h5>Response #{i + 1}</h5>
                  <p>{tweet}</p>
                </div>
              </>
            ))}
          </div>
        )}
      </div>
    );
  }
};

export default Test;
