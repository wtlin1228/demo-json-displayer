import { createContext, useContext, useState } from "react";

const data = {
  "a-string": "hello world",
  "a-number": 42,
  "an-array": [
    { name: "kirby", color: "pink", power: "puff" },
    {
      name: "pikmin",
      color: ["red", "yellow", "pink", "black"],
      dogs: {
        partner: "oatchi",
        opponent: "moss",
      },
    },
  ],
  "an-object": {
    a: 43,
    b: 44,
  },
};

const JsonPresenter = ({
  data,
  numberDisplay,
  stringDisplay,
  arrayDisplay,
  objectDisplay,
}) => {
  const copy = useContext(ClipboardContext);
  return (
    <div
      style={{
        marginInlineStart: "8px",
        minWidth: "200px",
        border: "1px dashed white",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "8px",
      }}
    >
      <button onClick={() => copy(data)}>copy object</button>
      {Object.entries(data).map(([key, value]) => {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "start",
              justifyContent: "space-between",
            }}
          >
            <h3>{key}</h3>
            {typeof value === "string"
              ? stringDisplay(value)
              : typeof value === "number"
              ? numberDisplay(value)
              : Array.isArray(value)
              ? arrayDisplay(value)
              : objectDisplay(value)}
          </div>
        );
      })}
    </div>
  );
};

const NumberDisplay = ({ data }) => {
  return <div style={{ textAlign: "right" }}>{data}</div>;
};
const StringDisplay = ({ data }) => {
  return <div style={{ textAlign: "right" }}>{data}</div>;
};
const ArrayDisplay = ({ data }) => {
  return (
    <div>
      {data.map((value) => {
        if (typeof value === "string") {
          return <StringDisplay data={value} />;
        } else if (typeof value === "number") {
          return <NumberDisplay data={value} />;
        } else if (Array.isArray(value)) {
          return <ArrayDisplay data={value} />;
        } else {
          return <MyJsonPresenterWithBinding data={value} />;
        }
      })}
    </div>
  );
};

const MyJsonPresenterWithBinding = ({ data }) => {
  return (
    <JsonPresenter
      data={data}
      numberDisplay={(number) => <NumberDisplay data={number} />}
      stringDisplay={(string) => <StringDisplay data={string} />}
      arrayDisplay={(array) => <ArrayDisplay data={array} />}
      objectDisplay={(object) => <MyJsonPresenterWithBinding data={object} />}
    />
  );
};

const ClipboardContext = createContext(null);

function App() {
  const [copied, setCopied] = useState("");
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "24px" }}>
      <ClipboardContext.Provider value={setCopied}>
        <MyJsonPresenterWithBinding data={data} />
      </ClipboardContext.Provider>
      <pre>{JSON.stringify(copied, null, 4)}</pre>
    </div>
  );
}

export default App;
