import { List } from "@raycast/api";
import { useState } from "react";
import { useDebouncedValue } from "../logic/hooks";

export const Main = () => {
  const [input, setInput] = useState("");

  const debouncedText = useDebouncedValue(input, 500);

  console.log(debouncedText);

  return (
    <List searchText={input} onSearchTextChange={setInput}>
      <List.Item title="Hello, World!" />
    </List>
  );
};
