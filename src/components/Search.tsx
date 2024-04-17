import React from "react";
import Flexsearch from "flexsearch";

function Search({ data }) {
  const [text, setText] = React.useState("");
  const [document] = React.useState(() => createDocument());

  React.useEffect(() => {
    data.forEach((item) => document.add({ ...item }));
  }, [data]);

  if (text) {
    console.log(document.search(text, 10));
  }

  return (
    <input value={text} onChange={(event) => setText(event.target.value)} />
  );
}

function createDocument() {
  return new Flexsearch.Document({
    tokenize: 'forward',
    document: {
      id: "id",
      index: ["title", "description"],
    },
  });
}

export default Search;
