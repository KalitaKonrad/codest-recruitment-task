import React, { useEffect, useState } from 'react';
import './App.css';
import { DebounceInput } from 'react-debounce-input';

const regexForTags = /{{ (\w+)\/(\w+) }}/g;

const specialTags = {};

const functions = {
  name: async (payload) => {
    if (specialTags.hasOwnProperty(payload)) {
      if (Date.now() - 15 * 60 > specialTags.date) {
        // simple cache invalidation, don't return -> refetch if 15 minutes
        // have passed
        return specialTags.payload.name;
      }
    }

    const currencies = await fetch(
      `https://api.coinpaprika.com/v1/search/q=${payload}`
    );

    const searchedCurrency = currencies.filter(
      (currency) => currency.symbol === payload
    )[0];

    specialTags.payload = { name: searchedCurrency.name, date: new Date() };

    return specialTags[payload.name];
  },
};

function App() {
  const [text, setText] = useState('');

  useEffect(() => {
    if (text) {
      const tagsToReplace = text.match(regexForTags);
      console.log(tagsToReplace);
      if (tagsToReplace) {
        for (const specialTag of tagsToReplace) {
          // tag format is: {{ func/argument }}
          const functionWithArgument = specialTag.split(' ')[1];
          const apiFunctionName = functionWithArgument
            .split('/')[0]
            .toLowerCase();
          const argument = functionWithArgument.split('/')[1];

          if (functions.hasOwnProperty(apiFunctionName)) {
            setText(
              text.replace(regexForTags, () => {
                functions[apiFunctionName](argument);
              })
            );
          }
        }
      }
    }
  }, [text]);

  return (
    <div className="app">
      <div className="container">
        <div className="editor">
          <DebounceInput
            element="textarea"
            onChange={(event) => {
              setText(event.target.value);
            }}
            debounceTimeout={300}
            className="editor__window"
          />
          ->
          <DebounceInput
            element="textarea"
            value={text}
            debounceTimeout={300}
            className="editor__window"
            onChange={() => {}}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
