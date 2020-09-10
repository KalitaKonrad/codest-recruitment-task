import React, { useState } from 'react'
import './App.css'
import { DebounceInput } from 'react-debounce-input'

const regexForTags = '/{{ (\\w+)\\/(\\w+) }}/g'

function App() {
  const [text, setText] = useState('')
  const specialTags = {}

  useEffect(() => {
    text.match(regexForTags).forEach((specialTag) => {
      if (!specialTags.hasOwnProperty(specialTag)) {
        specialTags[specialTag] = 'fetched from api'
      }
    })
    text.replace(regexForTags)
  }, text)

  return (
    <div className="app">
      <div className="container">
        <div className="editor">
          <DebounceInput
            element="textarea"
            onChange={(event) => {
              setText(event.target.value)
            }}
            debounceTimeout={300}
            className="editor__window"
          />
          ->
          <DebounceInput
            element="textarea"
            onChange={() => {
              setText(text + 1)
              console.log(state)
            }}
            debounceTimeout={300}
            className="editor__window"
          />
        </div>
      </div>
    </div>
  )
}

export default App
