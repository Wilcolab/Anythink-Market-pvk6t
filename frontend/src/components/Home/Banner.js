import React, { useState } from "react";
import agent from "../../agent";
import logo from "../../imgs/logo.png";
import { SEARCH_TITLE } from "../../constants/actionTypes";
import { connect } from "react-redux";

const mapStateToProps = (state) => ({
  ...state.itemList,
  // tags: state.home.tags,
  // token: state.common.token,
});

const mapDispatchToProps = (dispatch) => ({
  onSearch: (tab, pager, payload, searchValue) =>
    dispatch({ type: SEARCH_TITLE, tab, pager, payload, searchValue }),
});

const Banner = (props) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = async (event) => {
    setSearchValue(event.target.value);

    if (event.target.value.length >= 3) {
      agent.Items.search(searchValue).then((result) => {
        if (result.itemsCount === 0) {
          setSearchValue("");
        }

        props.onSearch("all", agent.Items.search, result, event.target.value);
      });
    }
  };

  return (
    <div className="banner text-white">
      <div className="container p-4 text-center">
        <img src={logo} alt="banner" />
        <div className="banner-text-container">
          <span>A place to </span>
          <span id="get-part"> get</span>
          <div className="search-container">
            <input
              id="search-box"
              type="text"
              placeholder="What is it that you truly desire?"
              value={searchValue}
              onChange={handleSearch}
            />
            <i className="ion-search"></i>
          </div>
          <span> the cool stuff.</span>
        </div>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Banner);
