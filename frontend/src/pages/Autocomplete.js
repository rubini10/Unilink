// Autocomplete.js
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import styled from 'styled-components';

const SuggestionContainer = styled.div`
  position: relative;
`;


const SuggestionItem = styled.div`
  padding: 5px 5px; /* Riduce il padding per ridurre lo spazio tra gli elementi */
  cursor: pointer;
  font-size: 12px; /* Dimensione del font ridotta */
  margin: 0; /* Rimuove il margin tra gli elementi */

  &.highlighted {
    background-color: #ddd;
  }
`;
const AddressAutocomplete = ({ value, onChange }) => {
  const [suggestions, setSuggestions] = useState([]);

  const onSuggestionsFetchRequested = ({ value }) => {
    if (value.length > 2) {
      axios
        .get(`https://nominatim.openstreetmap.org/search?format=json&q=${value}`)
        .then((response) => {
          setSuggestions(response.data);
        })
        .catch((error) => {
          console.error("Error fetching suggestions:", error);
        });
    } else {
      setSuggestions([]);
    }
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestionValue = (suggestion) => suggestion.display_name;

  const renderSuggestion = (suggestion, { isHighlighted }) => (
    <SuggestionItem className={isHighlighted ? 'highlighted' : ''}>
      {suggestion.display_name}
    </SuggestionItem>
  );

  return (
    <SuggestionContainer>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={{
          placeholder: 'Specifica il luogo',
          value,
          onChange: (_, { newValue }) => onChange(newValue)
        }}
        theme={{
          container: 'autosuggest-container',
          suggestionsContainerOpen: 'autosuggest-suggestions-container--open',
          suggestionsList: 'autosuggest-suggestions-list',
          suggestion: 'autosuggest-suggestion',
          suggestionHighlighted: 'autosuggest-suggestion--highlighted',
        }}
      />
      <style>{`
        .autosuggest-container {
          position: relative;
        }
        .autosuggest-suggestions-container--open {
          position: absolute;
          top: 100%;
          left: 0;
          width: 250px; 
          border: 1px solid #ccc;
          background-color: #fff;
          z-index: 2;
          max-height: 200px;
          overflow-y: auto;
        }
        .autosuggest-suggestions-list {
          margin: 0;
          padding: 0;
          list-style-type: none;
        }
        .autosuggest-suggestion {
          padding: 10px;
          cursor: pointer;
          font-size: 12px; 
        }
        .autosuggest-suggestion--highlighted {
          background-color: #ddd;
        }
      `}</style>
    </SuggestionContainer>
  );
};

AddressAutocomplete.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default AddressAutocomplete;
