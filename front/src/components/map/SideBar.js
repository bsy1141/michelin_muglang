import { useState, useEffect } from "react";

import {
  faMagnifyingGlass,
  faChevronLeft,
  faChevronRight,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

import RestaurantCard from "./RestaurantCard";
import styles from "../../css/map/SideBar.module.css";

import { serverUrl, perPage } from "../../data/MapConstant";
import RestaurantDetailCard from "./RestaurantDetailCard";

const SideBar = ({
  countryName,
  restaurants,
  clicked,
  handleClick,
  setRestaurants,
  setClicked,
}) => {
  const [restaurantList, setRestaurantList] = useState([]); //항상 해당 국가의 전체 음식점 리스트를 저장하는 state
  const [page, setPage] = useState(1); //전체 음식점 리스트 pagination을 담당하는 state
  const [searchPage, setSearchPage] = useState(1); //검색 시 나오는 음식점 리스트의 pagination을 담당하는 state
  const [totalPage, setTotalPage] = useState(1); //전체 음식점 리스트 전체 페이지 state
  const [searchTotalPage, setSearchTotalPage] = useState(1); //검색 시 나오는 음식점 리스트 전체 페이지 state
  const [selectedCategory, setSelectedCategory] = useState("name"); //검색 필터링 조건 state
  const [onSearch, setOnSearch] = useState(false); //검색 결과를 보고 있는지 여부를 나타내는 state
  const [searchKeyword, setSearchKeyword] = useState(""); //검색 키워드 저장 state
  const [noResult, setNoResult] = useState(false); //검색 결과가 있는지 여부를 확인할 수 있는 state

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(
        serverUrl +
          `restaurants/search?page=1&pageSize=${perPage}&country=${countryName}&${selectedCategory}=${searchKeyword}`,
      );
      const { data, last } = res.data;
      if (data.length === 0) {
        setNoResult(true);
      }
      setRestaurants(data);
      setSearchTotalPage(last);
    } catch (err) {
      console.log(err.message);
    }
    setOnSearch(true);
    setSearchKeyword("");
  };

  //국가의 전체 리스트로 돌아가기 위한 함수
  const goToList = () => {
    setRestaurants(restaurantList);
    setClicked(false);
    setOnSearch(false);
    setSearchKeyword("");
    setPage(1);
    setSearchPage(1);
    setNoResult(false);
  };

  // 이전 페이지로 넘기는 함수
  const goToPrevPage = () => {
    if (onSearch && searchPage > 1) {
      setSearchPage((prev) => prev - 1);
    } else if (!onSearch && page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  //다음 페이지로 넘기는 함수(total page를 아직 받지 못해서 임시로 3페이를 마지막페이지로 해둠)
  const goToNextPage = () => {
    if (onSearch && searchPage < searchTotalPage) {
      setSearchPage((prev) => prev + 1);
    } else if (!onSearch && page < totalPage) {
      setPage((prev) => prev + 1);
    }
  };

  const fetchRestaurants = async () => {
    // 검색 결과 리스트를 보고 있을 때와 전체 음식점 리스트를 보고 있을 때를 구분해줘야 함
    if (onSearch) {
      const res = await axios.get(
        serverUrl +
          `restaurants/search?page=${searchPage}&pageSize=${perPage}&country=${countryName}&${selectedCategory}=${searchKeyword}`,
      );
      const { data, last } = res.data;
      setRestaurants(data);
      setSearchTotalPage(last);
    } else {
      const res = await axios.get(
        serverUrl +
          `restaurants?country=${countryName}&page=${page}&pageSize=${perPage}`,
      );
      const { data, last } = res.data;
      setRestaurantList(data);
      setRestaurants(data);
      setTotalPage(last);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [page, searchPage]);

  return (
    <>
      {/* prev button & next button */}
      {!clicked && !noResult && (
        <>
          <button className={styles.prevBtn} onClick={goToPrevPage}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button className={styles.nextBtn} onClick={goToNextPage}>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </>
      )}

      {/* 검색 창 + 레스토랑 리스트  */}
      <div className={styles.detail_restaurantsList}>
        {/* 검색창 */}
        {!clicked && !onSearch && (
          <div className={styles.searchForm}>
            <form onSubmit={handleSubmit}>
              <select
                className={styles.searchForm_select}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="name">음식점 이름</option>
                <option value="address">주소</option>
                <option value="location">{"지역(도시)"}</option>
                <option value="cuisine">요리 종류</option>
                <option value="award">미슐랭 등급</option>
              </select>
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="다양한 키워드로 검색해보세요"
                className={styles.searchForm_container_input}
              />
              <button
                type="submit"
                className={styles.searchForm_container_submitBtn}
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </form>
          </div>
        )}
        {/* 검색 결과 안내 메세지 & 돌아가기 버튼 */}
        {onSearch && !clicked && (
          <div className={styles.searchResult_container}>
            <p className={styles.searchResult_message}>검색 결과</p>
            <button onClick={goToList} className={styles.searchResult_button}>
              <FontAwesomeIcon icon={faRotateLeft} />
            </button>
          </div>
        )}
        {noResult && (
          <div className={styles.message_noResult}>검색 결과가 없습니다.</div>
        )}
        {/* 레스토랑 리스트 */}
        {restaurants.map((restaurant) =>
          !clicked ? (
            <RestaurantCard
              key={restaurant._id}
              restaurant={restaurant}
              handleClick={handleClick}
            />
          ) : (
            <RestaurantDetailCard
              key={restaurant._id}
              restaurant={restaurant}
              goToList={goToList}
            />
          ),
        )}
      </div>
    </>
  );
};

export default SideBar;
