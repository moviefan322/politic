import React, { useState } from "react";
import styles from "@/pages/date.module.css";
import Link from "next/link";

const Dates = () => {
  const [dateArr, setDateArr] = useState<number[] | null>(null);
  const [date, setDate] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const handleTimestamp = () => {
    const date: number = new Date().getTime();
    setDate(date);
  };

  const handleSaveToDB = () => {
    if (!dateArr) {
      setDateArr([date!]);
      return;
    }
    setDateArr([...dateArr, date!]);
  };

  const handleSortAscending = () => {
    if (!dateArr) return;
    const sortedArr = [...dateArr].sort((a, b) => a - b);
    setDateArr(sortedArr);
  };

  const handleSortDescending = () => {
    if (!dateArr) return;
    const sortedArr = [...dateArr].sort((a, b) => b - a);
    setDateArr(sortedArr);
  };

  const formatMinutesAndHours = (num: number) => {
    return num < 10 ? `0${num}` : num;
  };

  const outputSelected = () => {
    if (!selectedDate) return;
    const date = new Date(selectedDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = formatMinutesAndHours(date.getHours());
    const minutes = formatMinutesAndHours(date.getMinutes());
    const seconds = formatMinutesAndHours(date.getSeconds());
    const output = `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
    return output;
  };

  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <div className="d-flex flex-row m-3">
          {" "}
          <button className="me-3" onClick={handleTimestamp}>
            Generate Timestamp
          </button>
          <button onClick={handleSaveToDB} disabled={!date}>
            Save to DB
          </button>
        </div>

        <div className={styles.timestamp}>
          {date && <p>{date.toString()}</p>}
        </div>
      </div>
      <div className="d-flex flex-column justify-content-center align-items-center pt-5">
        <h2>DB</h2>
        <div className={`${styles.db}`}>
          {dateArr &&
            dateArr.map((date, i) => (
              <div key={i} className={`${styles.dbData}`}>
                <button
                  className={styles.noStyleButt}
                  onClick={() => setSelectedDate(date)}
                >
                  <p
                    style={
                      date === selectedDate
                        ? { backgroundColor: "blue", color: "white" }
                        : {}
                    }
                  >
                    {date.toString()}
                  </p>
                </button>
              </div>
            ))}
        </div>
        <p className="mt-3">Click an item for output</p>
        <div className="pt-3">
          {" "}
          <button className="me-3" onClick={handleSortAscending}>
            Sort Ascending
          </button>
          <button onClick={handleSortDescending}>Sort Descending</button>
        </div>
      </div>
      <div className="d-flex flex-column justify-content-center align-items-center mt-5">
        <h2>Output:</h2>
        <div className={styles.timestamp}>
          {selectedDate && <p>{outputSelected()}</p>}
        </div>
      </div>

      <div className="mx-3">
        Full code:
        <Link href=""></Link>
      </div>
    </>
  );
};

export default Dates;
