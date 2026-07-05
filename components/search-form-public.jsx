"use client";

import { Search, X, BookOpen, User, Building } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export function SearchForm({ 
  onSearchChange, 
  books = [],
  showSuggestions = true,
  ...props 
}) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (value.length > 0 && showSuggestions) {
      const keyword = value.toLowerCase();
      
      const bookSuggestions = books
        .filter(book => book.title.toLowerCase().includes(keyword))
        .slice(0, 3)
        .map(book => ({ type: 'book', text: book.title, icon: BookOpen }));

      const authorSuggestions = [...new Set(books
        .filter(book => book.author.toLowerCase().includes(keyword))
        .map(book => book.author))]
        .slice(0, 2)
        .map(author => ({ type: 'author', text: author, icon: User }));

      const publisherSuggestions = [...new Set(books
        .filter(book => book.publisher.toLowerCase().includes(keyword))
        .map(book => book.publisher))]
        .slice(0, 2)
        .map(publisher => ({ type: 'publisher', text: publisher, icon: Building }));

      setSuggestions([...bookSuggestions, ...authorSuggestions, ...publisherSuggestions]);
      setShowDropdown(true);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  }, [value, books, showSuggestions]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    onSearchChange(newValue);
  };

  const handleClear = () => {
    setValue("");
    onSearchChange("");
    setSuggestions([]);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion) => {
    setValue(suggestion.text);
    onSearchChange(suggestion.text);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full" {...props}>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Search className="h-4 w-4" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => {
            setIsFocused(true);
            if (value.length > 0) {
              setShowDropdown(true);
            }
          }}
          onBlur={() => setTimeout(() => {
            setIsFocused(false);
            setShowDropdown(false);
          }, 200)}
          placeholder="Search..."
          className="
            w-full pl-10 pr-10 py-2.5
            bg-white
            border border-gray-300 rounded-lg
            text-sm
            placeholder:text-gray-400
            focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500
            transition-colors duration-200
          "
        />

        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="h-3 w-3 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {showDropdown && suggestions.length > 0 && (
        <div className="absolute top-full mt-1 left-0 right-0 z-50">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            <div className="py-1">
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-xs font-medium text-gray-500">
                  Search Suggestions
                </p>
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-3 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-b-0"
                >
                  <div className={`p-1.5 rounded-md ${
                    suggestion.type === 'book' ? 'bg-blue-50' :
                    suggestion.type === 'author' ? 'bg-purple-50' :
                    'bg-green-50'
                  }`}>
                    <suggestion.icon className={`h-3 w-3 ${
                      suggestion.type === 'book' ? 'text-blue-600' :
                      suggestion.type === 'author' ? 'text-purple-600' :
                      'text-green-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">
                      {suggestion.text}
                    </p>
                    <p className="text-xs text-gray-500 capitalize mt-0.5">
                      {suggestion.type}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showDropdown && value.length > 0 && suggestions.length === 0 && (
        <div className="absolute top-full mt-1 left-0 right-0 z-50">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="px-3 py-4 text-center">
              <Search className="h-4 w-4 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">No results found for "{value}"</p>
              <p className="text-xs text-gray-500 mt-1">Try different keywords</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}