import { useState } from "react";
import styles from "@/components/params.module.css";
import { FaAngleDown } from "react-icons/fa";
import { InputMask } from "primereact/inputmask";
import IParams from "@/types/Params";
import { set } from "mongoose";

interface ParamsProps {
  setParams: React.Dispatch<React.SetStateAction<IParams>>;
  params: IParams;
}

const Params = ({ setParams, params }: ParamsProps) => {
  const [keywordChecked, setKeywordChecked] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("United States");
  const [selectedCandidate, setSelectedCandidate] = useState("Eric Adams");
  const [selectedPlatform, setSelectedPlatform] = useState("Twitter");
  const [negTweetCutoffValue, setNegTweetCutoffValue] = useState(50);
  const [posTweetCutoffValue, setPosTweetCutoffValue] = useState(50);
  const [dateRange, setDateRange] = useState<string>("");
  const [keywords, setKeywords] = useState("");
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const [showDropdown3, setShowDropdown3] = useState(false);
  const candidates = [
    "Eric Adams",
    "Shaun Donovan",
    "Kathryn Garcia",
    "Raymond McGuire",
    "Dianne Morales",
    "Scott Stringer",
    "Maya Wiley",
    "D. K. Shivakumar",
  ];
  const countries = [
    "United States",
    "India",
    "United Kingdom",
    "Canada",
    "Australia",
  ];
  const platforms = ["Twitter", "Youtube", "Facebook", "Instagram"];

  const handleKeywordCheckboxChange = () => {
    setKeywordChecked(!keywordChecked);
  };

  const handleNegTweetCutoffChange = (event: any) => {
    setNegTweetCutoffValue(event.target.value);
  };

  const handlePosTweetCutoffChange = (event: any) => {
    setPosTweetCutoffValue(event.target.value);
  };

  const handleKeywordChange = (event: any) => {
    setKeywords(event.target.value);
  };

  const handleRunAnalysis = () => {
    setParams({
      country: selectedCountry,
      candidate: selectedCandidate
        .toLowerCase()
        .replace(/[^a-z_:\s]/g, "")
        .split(" ")
        .join("_"),
      platform: selectedPlatform.toLowerCase(),
      negTweetCutoff: +negTweetCutoffValue,
      posTweetCutoff: +posTweetCutoffValue,
      dateRange: dateRange,
      keywords: keywords.split(",").map((keyword) => keyword.trim()),
      showChart: true,
    });

    console.log("params:", params);
  };

  const handleCountrySelectArrow = () => {
    setShowDropdown1(!showDropdown1);
  };

  const handleCandidateSelectArrow = () => {
    setShowDropdown2(!showDropdown2);
  };

  const handlePlatformSelectArrow = () => {
    setShowDropdown3(!showDropdown3);
  };

  const handleSelectCountry = (country: string) => {
    setSelectedCountry(country);
    setShowDropdown1(false);
  };

  const handleSelectCandidate = (candidate: string) => {
    setSelectedCandidate(candidate);
    setShowDropdown2(false);
  };

  const handleSelectPlatform = (platform: string) => {
    setSelectedPlatform(platform);
    setShowDropdown3(false);
  };

  return (
    <div className={styles.params}>
      <div className="row">
        <div className="col-3 offset-3 d-flex flex-column text-secondary">
          <div className={styles.box}>
            <p className={styles.boxHeader}>Country</p>
            <p className={styles.boxSelected}>{selectedCountry}</p>
            <div className={styles.dropDownContainer}>
              {" "}
              <button
                onClick={handleCountrySelectArrow}
                className={styles.boxIcon}
              >
                <FaAngleDown />
              </button>
              {showDropdown1 && (
                <div className={styles.dropDown}>
                  {countries.map((country) => (
                    <p
                      key={country}
                      onClick={() => handleSelectCountry(country)}
                      className={styles.dropDownItem}
                    >
                      {country}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-3 d-flex flex-column text-secondary">
          <div className={styles.box}>
            <p className={styles.boxHeader}>Candidate</p>
            <p className={styles.boxSelected}>{selectedCandidate}</p>
            <button
              onClick={handleCandidateSelectArrow}
              className={styles.boxIcon}
            >
              <FaAngleDown />
            </button>
            {showDropdown2 && (
              <div className={styles.dropDown}>
                {candidates.map((candidate) => (
                  <p
                    key={candidate}
                    onClick={() => handleSelectCandidate(candidate)}
                    className={styles.dropDownItem}
                  >
                    {candidate}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="col-3 d-flex flex-column text-secondary">
          <div className={styles.box}>
            <p className={styles.boxHeader}>Platform</p>
            <p className={styles.boxSelected}>{selectedPlatform}</p>
            <button
              onClick={handlePlatformSelectArrow}
              className={styles.boxIcon}
            >
              <FaAngleDown />
            </button>
            {showDropdown3 && (
              <div className={styles.dropDown}>
                {platforms.map((platform) => (
                  <p
                    key={platform}
                    onClick={() => handleSelectPlatform(platform)}
                    className={styles.dropDownItem}
                  >
                    {platform}
                  </p>
                ))}
              </div>
            )}
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
            value={keywords}
            onChange={handleKeywordChange}
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
          <div className={`mx-auto w-50 ${styles.dinputDiv}`}>
            <InputMask
              className={`text-center mx-auto ${styles.dateInput}`}
              type="text"
              placeholder="Date Range"
              value={dateRange || ""}
              onChange={(event: any) => setDateRange(event.target.value)}
              mask="99/99/9999 - 99/99/9999"
              slotChar="mm/dd/yyyy - mm/dd/yyyy"
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
