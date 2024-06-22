import { useState } from "react";

import { Action, ActionPanel, getPreferenceValues, Icon, List } from "@raycast/api";
import { useFetch } from "@raycast/utils";

import { DictDetail } from "./DictDetail";

import { useDebouncedValue } from "../logic/hooks";

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
      actions={
        <ActionPanel>
          <Action.OpenInBrowser
            title="Open GitHub"
            url="https://github.com/CofCat456/raycast-chinese-dictionary"
            icon={Icon.Code}
          />
        </ActionPanel>
      }
    >
      {result != null ? (
        <List.Item
          title={result.title}
          accessories={[{ text: result.Field }]}
          detail={<DictDetail heteronyms={result.concise_dict.heteronyms} />}
          actions={
            <ActionPanel>
              <ActionPanel.Section>
                <Action.OpenInBrowser
                  title="Open in Web"
                  shortcut={{ modifiers: ["opt"], key: "enter" }}
                  url={`https://pedia.cloud.edu.tw/Entry/Detail?title=${encodeURIComponent(result.title)}`}
                />
              </ActionPanel.Section>
            </ActionPanel>
          }
        />
      ) : null}
    </List>
  );
};
