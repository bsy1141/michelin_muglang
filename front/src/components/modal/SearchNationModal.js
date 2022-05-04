import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../css/modal/SearchNationModal.module.css";
import { countries } from "../../data/MapConstant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const SearchNationModal = ({ setIsModalOpen }) => {
  const navigate = useNavigate();
  const [searchedList, setSearchedList] = useState([]);
  const [keyword, setKeyword] = useState("");
  const updateChange = (e) => {
    //setKeyword(e.target.value);
    const keyword = e.target.value.toLowerCase();
    let filteredList = countries.filter((c) =>
      c.toLowerCase().includes(keyword),
    );
    if (keyword.length === 0) {
      filteredList = [];
    }
    setSearchedList(filteredList);
  };

  const handleClick = (nation) => {
    setSearchedList([]);
    navigate(`/detail?country=${nation}`);
  };

  useEffect(() => {
    document.body.style.cssText = `position: fixed; top: -${window.scrollY}px`;
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.cssText = `position: ""; top: "";`;
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    };
  }, []);
  return (
    <div className={styles.container}>
      <section>
        <div className={styles.input}>
          <span>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </span>
          <input
            type="text"
            value={keyword}
            placeholder="국가를 입력해주세요..."
            onChange={(e) => updateChange(e)}
          />
        </div>
        <div className={styles.result}>
          {searchedList.length === 0 ? (
            <div>검색 결과가 없습니다.</div>
          ) : (
            searchedList.map((nation) => (
              <div className={styles.result_item}>
                <p onClick={() => handleClick(nation)}>{nation}</p>
              </div>
            ))
          )}
        </div>
        <button onClick={() => setIsModalOpen(false)}>close</button>
      </section>
    </div>
  );
};

export default SearchNationModal;
