import React, { useEffect, useMemo } from "react";
import DateRangePicker from "./DateRangePicker";
import PackageRoomItem from "./PackageRoomItem"; // 패키지 컴포넌트
import OneRoomItem from "./OneRoomItem"; // 객실 컴포넌트
import "../../scss/common.scss";
import "../../scss/reservation.scss";
import useReservationStore from "../../store/reservationStore";

function Res_search() {
  // const navigate = useNavigate();
  const {
    isLoading,
    checkInDate,
    checkOutDate,
    availablePackages,
    availableRooms,
    showPicker,
    tab,
    popupAdultCount,
    popupChildrenCount,
    confirmedAdultCount,
    confirmedChildrenCount,
    isPopupVisible,
    sortingOrder,
    isSortingOpen,
    isSearchClicked,
    setDate,
    togglePicker,
    setTab,
    togglePopup,
    closePopup,
    handleConfirm,
    incrementCount,
    decrementCount,
    handleSortChange,
    toggleSortingDropdown,
    handleSearch,
  } = useReservationStore();

  // 가격 정렬 함수
  const sortedAvailablePackages = useMemo(() => {
    const sorted = [...availablePackages];
    if (sortingOrder === "lowToHigh") {
      return sorted.sort((a, b) => a.offer_price - b.offer_price);
    }
    if (sortingOrder === "highToLow") {
      return sorted.sort((a, b) => b.offer_price - a.offer_price);
    }
    return sorted;
  }, [availablePackages, sortingOrder]);

  const sortedAvailableRooms = useMemo(() => {
    const sorted = [...availableRooms];
    if (sortingOrder === "lowToHigh") {
      return sorted.sort((a, b) => a.day_price - b.day_price);
    }
    if (sortingOrder === "highToLow") {
      return sorted.sort((a, b) => b.day_price - a.day_price);
    }
    return sorted;
  }, [availableRooms, sortingOrder]);

  useEffect(() => {
    if (tab === "package") {
      // 정렬된 패키지 사용
    } else if (tab === "room") {
      // 정렬된 룸 사용
    }
  }, [sortingOrder, tab]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container reservation">
      <section className="reservation">
        <div className="center">
          <h2>날짜, 인원 선택</h2>
          <div className="reservation-wrap">
            <div className="date-wrap">
              <span className="tit">CHECK IN / OUT</span>
              <DateRangePicker
                onDateChange={setDate}
                showPicker={showPicker}
                togglePicker={togglePicker}
              />
            </div>
            <div className="room-wrap" onClick={togglePopup}>
              <div className="box adult">
                <span className="tit">ADULT</span>
                <span className="num">{confirmedAdultCount}</span>
              </div>
              <div className="box children">
                <span className="tit">CHILDREN</span>
                <span className="num">{confirmedChildrenCount}</span>
              </div>
            </div>
              <button
                type="button"
                className="reservation-search-btn"
                onClick={handleSearch}
              >
                검색
              </button>
            <div className={`reservation-popup ${isPopupVisible ? "on" : ""}`}>
              <form action="">
                <ul className="popup-left">
                  <li>
                    <div className="tit">객실 1</div>
                    <div className="count-wrap adult">
                      <button
                        type="button"
                        className="btn-down"
                        onClick={() => decrementCount("adult")}
                      >
                        <span className="blind">숫자 내리기</span>
                      </button>
                      <p className="adult">
                        성인 <span className="num">{popupAdultCount}</span>
                      </p>
                      <button
                        type="button"
                        className="btn-up"
                        onClick={() => incrementCount("adult")}
                      >
                        <span className="blind">숫자 올리기</span>
                      </button>
                    </div>
                    <div className="count-wrap children">
                      <button
                        type="button"
                        className="btn-down"
                        onClick={() => decrementCount("children")}
                      >
                        <span className="blind">숫자 내리기</span>
                      </button>
                      <p className="children">
                        어린이 <span className="num">{popupChildrenCount}</span>
                      </p>
                      <button
                        type="button"
                        className="btn-up"
                        onClick={() => incrementCount("children")}
                      >
                        <span className="blind">숫자 올리기</span>
                      </button>
                    </div>
                  </li>
                </ul>
                <div className="popup-right">
                  <p className="desc">* 어린이 기준 : 37개월 - 12세</p>
                  <button type="button" onClick={handleConfirm}>
                    확인
                  </button>
                </div>
              </form>

              <button
                className="close-btn" onClick={closePopup}>
                <span className="blind">닫기</span>
              </button>
            </div>
          </div>
          <div className={`no-select ${isSearchClicked ? "" : "on"}`}>
            예약을 원하시는 날짜, 인원을 선택해주세요.
          </div>
          <div className="loading-overlay">
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
          <div className={`search-results-wrap ${isSearchClicked ? "on" : ""}`}>
            {isSearchClicked && (
              <div>
            <div className="tab-wrap">
              <ul className="tab">
              <li
                  className={tab === "room" ? "on" : ""}
                  onClick={() => setTab("room")}
                >
                  객실 (
                  <em className="num">{sortedAvailableRooms.length}</em>
                  )
                </li>
                <li
                  className={tab === "package" ? "on" : ""}
                  onClick={() => {
                    setTab("package");
                  }}
                >
                  패키지 (
                  <em className="num">
                    {availablePackages.length > 0
                      ? `${availablePackages.length}`
                      : "0"}
                  </em>
                  )
                </li>
              </ul>
              <div className="keyword-sorting">
                <div className="sorting-wrap">
                  <div
                    className={`selected ${isSortingOpen ? "on" : ""}`}
                    onClick={toggleSortingDropdown}
                  >
                    {sortingOrder === ""
                      ? "필터 가격 순"
                      : sortingOrder === "lowToHigh"
                      ? "낮은 가격 순"
                      : "높은 가격 순"}
                  </div>
                  {isSortingOpen && (
                    <ul className="select-sort">
                      <li
                        className={sortingOrder === "lowToHigh" ? "on" : ""}
                        onClick={() => handleSortChange("lowToHigh")}
                      >
                        낮은 가격 순
                      </li>
                      <li
                        className={sortingOrder === "highToLow" ? "on" : ""}
                        onClick={() => handleSortChange("highToLow")}
                      >
                        높은 가격 순
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* 선택된 탭에 따라 콘텐츠 표시 */}
            <div className="tab-cont-wrap">
              {tab === "package" ? (
                <div className="tab-cont package on">
                  {sortedAvailablePackages.map((pkg, index) => (
                    <PackageRoomItem
                      key={pkg.offer_id}
                      packageData={pkg}
                      index={index}
                      checkInDate={checkInDate}
                      checkOutDate={checkOutDate}
                      adultCount={confirmedAdultCount}
                      childrenCount={confirmedChildrenCount}
                    />
                  ))}
                </div>
              ) : (
                <div className="tab-cont room on">
                  <OneRoomItem
                    rooms={sortedAvailableRooms}
                    checkInDate={checkInDate}
                    checkOutDate={checkOutDate}
                    adultCount={confirmedAdultCount}
                    childrenCount={confirmedChildrenCount}
                  />
                </div>
              )}
            </div>
            </div>
            )}
          </div> // 검색결과영역
              )}
        </div>
        </div>
      </section>
    </div>
  );
}

export default Res_search;
