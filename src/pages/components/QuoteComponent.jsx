import { useState, useEffect } from "react";
import "./QouteComponent.css";

const QuoteComponent = () => {
  const [quote, setQuote] = useState("Loading...");

  useEffect(() => {
    fetch("https://thingproxy.freeboard.io/fetch/https://zenquotes.io/api/random")

      .then((res) => {
        console.log("Response:", res);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Data received:", data);
        setQuote(data[0].q); 
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setQuote("Stay focused, stay strong!");
      });
  }, []);

  return (
    <div className="QuoteContainer">
      <h4 className="QouteTitle">MomentuQuote</h4>
      <p className="Quote">💡 {quote}</p>
      </div>
  );
 
};

export default QuoteComponent;
