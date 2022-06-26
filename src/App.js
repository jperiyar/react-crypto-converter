import { useCallback, useEffect, useReducer, useState } from "react";
import _, { initial } from "lodash";
import "./styles.css";
import useDebounce from "./hooks/useDebounce";

export default function App() {
  const [currency, setCurrency] = useState("usd");
  const [input, setInput] = useState(0);
  const debouncedInput = useDebounce(input, 1000);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const initialState = {
    current: 0,
    prev: 0
  };

  const roundByTwo = (num) => Math.round(parseFloat(num) * 100) / 100;

  const reducer = (state = initialState, action) => {
    const {
      payload: { rate, inputVal }
    } = action;
    switch (action.type) {
      case "UPDATE":
        return {
          ...state,
          current: roundByTwo(rate * inputVal),
          // current: (rate * inputVal),
          prev: state.current
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  async function fetchData() {
    const data = await fetch(`${process.env.REACT_APP_API_URL}/${currency}`)
      .then((res) => {
        return res.json();
      })
      .catch((err) => console.log("fetch request failed!"));

    dispatch({
      type: "UPDATE",
      payload: {
        rate: parseFloat(data.value),
        inputVal: input
      }
    });
    // setCurrencyFactor( data.value );
  }

  useEffect(() => {
    if (debouncedInput) fetchData();
  }, [debouncedInput]);

  return (
    <div className="App">
      <h1>Crypto Converter</h1>
      <form>
        <div className="row">
          <input type="number" value={input} onChange={handleInputChange} />
          <select value={currency} onChange={handleCurrencyChange}>
            <option value="usd">USD</option>
            <option value="geb">GEB</option>
          </select>
        </div>
        {input > 0 && (
          <div>
            {state.current}
            {/* {(parseFloat(state.current)).toFixed(2)} */}
            {/* {parseFloat(state.current - state.prev).toFixed(2)} */}
            {/* {state.prev} */}
          </div>
        )}
      </form>
    </div>
  );
}
