import { useState } from "react";
import styles from "@/components/params.module.css";
import { FaAngleDown } from "react-icons/fa";

interface ParamsProps {
  setParams: any;
}

const Params = ({ setParams }: ParamsProps) => {
  const [keywordChecked, setKeywordChecked] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("United States");
  const [selectedCandidate, setSelectedCandidate] = useState("Eric Adams");
  const [selectedPlatform, setSelectedPlatform] = useState("Twitter");
  const [negTweetCutoffValue, setNegTweetCutoffValue] = useState(50);
  const [posTweetCutoffValue, setPosTweetCutoffValue] = useState(50);
  const [dateRange, setDateRange] = useState("");

  const handleKeywordCheckboxChange = () => {
    setKeywordChecked(!keywordChecked);
  };

  const handleNegTweetCutoffChange = (event: any) => {
    setNegTweetCutoffValue(event.target.value);
  };

  const handlePosTweetCutoffChange = (event: any) => {
    setPosTweetCutoffValue(event.target.value);
  };

  const handleRunAnalysis = () => {
    setParams({
      country: selectedCountry,
      candidate: selectedCandidate,
      platform: selectedPlatform,
      negTweetCutoff: negTweetCutoffValue,
      posTweetCutoff: posTweetCutoffValue,
      dateRange: dateRange,
      showChart: true,
    });
  };

  return (
    <div className={styles.params}>
      <div className="row">
        <div className="col-3 offset-3 d-flex flex-column text-secondary">
          <div className={styles.box}>
            <p className={styles.boxHeader}>Country</p>
            <p className={styles.boxSelected}>{selectedCountry}</p>
            <button className={styles.boxIcon}>
              <FaAngleDown />
            </button>
          </div>
        </div>
        <div className="col-3 d-flex flex-column text-secondary">
          <div className={styles.box}>
            <p className={styles.boxHeader}>Candidate</p>
            <p className={styles.boxSelected}>{selectedCandidate}</p>
            <button className={styles.boxIcon}>
              <FaAngleDown />
            </button>
          </div>
        </div>
        <div className="col-3 d-flex flex-column text-secondary">
          <div className={styles.box}>
            <p className={styles.boxHeader}>Platform</p>
            <p className={styles.boxSelected}>{selectedPlatform}</p>
            <button className={styles.boxIcon}>
              <FaAngleDown />
            </button>
          </div>
        </div>
      </div>
      <div className="row mt-4 text-secondary">
        <div className="d-flex flex-column align-items-center justify-content-end col-3 mb-5">
          <input
            type="checkbox"
            id="keyword"
            name="keyword"
            checked={keywordChecked}
            onChange={handleKeywordCheckboxChange}
          />
          <label className="text-secondary" htmlFor="keyword">
            Keyword Search
          </label>
          <input
            className="text-center"
            type="text"
            id="keywordInput"
            name="keywordInput"
            placeholder="Negative, Tweets"
            style={!keywordChecked ? { display: "none" } : {}}
          />
        </div>
        <div className="col-3">
          <div className="d-flex flex-row justify-content-between">
            <p>0</p>
            <p className="text-dark">{negTweetCutoffValue}</p>
            <p>100</p>
          </div>
          <input
            className="w-100"
            type="range"
            id="negTweetCutoff"
            name="negTweetCutoff"
            min={0}
            max={100}
            value={negTweetCutoffValue}
            onChange={handleNegTweetCutoffChange}
          />
          <p className="text-center">% Cutoff of Negative Tweets</p>
        </div>
        <div className="col-3">
          <div className="d-flex flex-row justify-content-between">
            <p>0</p>
            <p className="text-dark">{posTweetCutoffValue}</p>
            <p>100</p>
          </div>
          <input
            className="w-100"
            type="range"
            id="posTweetCutoff"
            name="posTweetCutoff"
            min={0}
            max={100}
            value={posTweetCutoffValue}
            onChange={handlePosTweetCutoffChange}
          />
          <p className="text-center">% Cutoff of Positive Tweets</p>
        </div>
        <div className="col-3">
          <div className="mx-auto w-50">
            <input
              className="text-center mx-auto"
              type="text"
              placeholder="Date Range"
              value={dateRange}
              onChange={(event) => setDateRange(event.target.value)}
            />
          </div>

          <button onClick={handleRunAnalysis} className={styles.runAnal}>
            Run Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default Params;
