import React, { useState, useEffect } from "react";
import { FaUserCircle, FaHeart, FaShoppingCart, FaSearch, FaCaretDown, FaTimes } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Predefined search keywords
  const searchKeywords = [
    { term: "anklet", route: "/womens/anklets" },
    { term: "paayal", route: "/womens/anklets" },
    { term: "toe ring", route: "/womens/toerings" },
    { term: "Choker", route: "/womens/choker" },
    { term: "Mangalsutra", route: "/womens/mangalsutra" },
    { term: "Silver Chains for Mens", route: "/silver-chains" },
    { term: "Punjabi Kada for Mens", route: "/mens-punjabi-kada" },
    { term: "Kumkum Box", route: "/kumkum-box" },
    { term: "Silver Coins", route: "/coins" },
  ];

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query) {
      const filteredSuggestions = searchKeywords.filter((keyword) =>
        keyword.term.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = (route) => {
    if (route) {
      navigate(route);
    } else if (searchQuery) {
      const matchedKeyword = searchKeywords.find(
        (keyword) => keyword.term.toLowerCase() === searchQuery.toLowerCase()
      );
      if (matchedKeyword) {
        navigate(matchedKeyword.route);
      } else {
        alert("No matching items found!");
      }
    }
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  useEffect(() => {
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  }, [location]);

  return (
    <nav className="navbar">
      <div className="navbar-top">
        <div className="navbar-left">
          <h1 className="navbar-brand">Veva Jewels</h1>
        </div>

        <div className="navbar-middle">
          <div className="search-container">
            <input
              type="text"
              className="search-bar"
              placeholder="Search jewelry..."
              value={searchQuery}
              onChange={handleInputChange}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              onFocus={() => searchQuery && setShowSuggestions(true)}
            />
            {searchQuery && (
              <button className="clear-button" onClick={clearSearch}>
                <FaTimes className="clear-icon" />
              </button>
            )}
            <button className="search-button" onClick={() => handleSearch()}>
              <FaSearch className="search-icon" />
            </button>
{showSuggestions && suggestions.length > 0 && (
  <ul className="suggestions-dropdown">
    {suggestions.map((suggestion, index) => {
      const startIdx = suggestion.term.toLowerCase().indexOf(searchQuery.toLowerCase());
      const endIdx = startIdx + searchQuery.length;
      
      return (
        <li
          key={index}
          className="suggestion-item"
          onClick={() => handleSearch(suggestion.route)}
        >
          {startIdx >= 0 ? (
            <>
              {suggestion.term.substring(0, startIdx)}
              <span className="suggestion-highlight">
                {suggestion.term.substring(startIdx, endIdx)}
              </span>
              {suggestion.term.substring(endIdx)}
            </>
          ) : (
            suggestion.term
          )}
        </li>
      );
    })}
  </ul>
)}
          </div>
        </div>

        <div className="navbar-right">
          <Link to="/login" className="icon">
            <FaUserCircle className="icon-style" />
            <span className="icon-text">Profile</span>
          </Link>
          <Link to="/wishlist" className="icon">
            <FaHeart className="icon-style" />
            <span className="icon-text">Wishlist</span>
          </Link>
          <Link to="/cart" className="icon">
            <FaShoppingCart className="icon-style" />
            <span className="icon-text">Cart</span>
          </Link>
        </div>
      </div>

      <div className="inline-menu">
        <div className="menu-item">
          <Link to="/" className="menu-link">
            Home
          </Link>
        </div>
        <div className="menu-item">
          Women's Jewellery <FaCaretDown className="caret-icon" />
          <div className="dropdown-content">
            <Link to="/womens/mangalsutra">Mangalsutra</Link>
            <Link to="/womens/anklets">Anklets</Link>
            <Link to="/womens/toerings">Toe Rings</Link>
            <Link to="/womens/choker">Chokers</Link>
          </div>
        </div>
        <div className="menu-item">
          <Link to="/about-us" className="menu-link">
            About Us
          </Link>
        </div>
        <div className="menu-item">
          <Link to="/contact-us" className="menu-link">
            Contact Us
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;