import { useState } from "react";

import { getPreferenceValues, List } from "@raycast/api";
import { useFetch } from "@raycast/utils";

import { DictDetail } from "./DictDetail";

import { useDebouncedValue } from "../logic/hooks";

import _testData from "../data/test.json";
import { WordData } from "../logic/types";

export const Main = () => {
  const { apiKey } = getPreferenceValues();
  const [isShowingDetail] = useState(true);
  const [input, setInput] = useState("");

  const debouncedText = useDebouncedValue(input, 500);

  const { data: result, isLoading } = useFetch<WordData, null>(
    `https://pedia.cloud.edu.tw/api/v2/Detail?term=${debouncedText}&api_key=${apiKey}`,
    {
      keepPreviousData: true,
      execute: debouncedText.length > 0,
      mapResult: (data) => ({ data }),
      initialData: null,
    },
  );

  return (
    <List
      throttle
      isLoading={isLoading}
      isShowingDetail={isShowingDetail}
      searchText={input}
      onSearchTextChange={setInput}
    >
      {result != null ? (
        <List.Item
          title={result.title}
          accessories={[{ text: result.Field }]}
          detail={<DictDetail heteronyms={result.concise_dict.heteronyms} />}
        />
      ) : null}
    </List>
  );
};
