import React, { useEffect, useState, useRef } from "react";
import styles from './searchBox.module.css';
import { debouncer } from '../../helper/debounce';
import { getSuggestions } from "../../api/mockServer";

const SearchBox = () => {
  const [suggestion, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [searchedValue, setSearchedValue] = useState("");
  const [showList, setShowList] = useState(true);
  const node = useRef();

  // This handles the mouse click events for suggestion list
  const handleClick = event => {
    if (node.current && node.current.contains(event.target)) {
      return;
    }
    setShowList(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [node]);

  const handleOnChange = (searchValue) => {
    setInputValue(searchValue);
    // Below gives the recent searching value for filtering suggestions
    const recentSearchValue = searchValue.trim().slice(searchValue.lastIndexOf(' ') + 1, searchValue.length);

    debouncer(() => {
      getSuggestions(recentSearchValue)
        .then(response => setSuggestions(response))
        .catch(error => console.log(error))
    }, 500)();

    setSearchedValue(recentSearchValue);
  }

  const handleOnClick = (listValue) => {
    // Below replaces the typed search(last text after white space)
    // with the clicked list value
    setInputValue(inputValue.replace(new RegExp(searchedValue + '$'), `${listValue} `));
  }

  return (
    <div className={styles.searchWrapper}>
      <h2 className={styles.boxHeading}>
        Enter a value
      </h2>
      <input
        className={styles.inputField}
        type="text"
        value={inputValue}
        onChange={event => handleOnChange(event.target.value)}
        onClick={() => setShowList(true)}
      />
      {
        /*
        The below conditions are to check
        last character in search field is not a white space,
        suggestion list is not empty,
        value is entered or not and
        if mouse is clicked outside the list (to close suggestions list)
        */
        inputValue.slice(-1) !== " " && suggestion.length > 0 && inputValue.trim() !== ""
        && showList && (
          <ul ref={node} className={styles.suggestions}>
            {suggestion.map((suggestions, index) => (
              <li key={index} onClick={(event) => handleOnClick(event.currentTarget.innerText)}>
                {suggestions}
              </li>
            ))}
          </ul>
        )
      }
    </div >
  )
}

export default SearchBox
