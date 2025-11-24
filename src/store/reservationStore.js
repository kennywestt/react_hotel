import { create } from "zustand";
import axios from "axios";

const bkURL = process.env.REACT_APP_BACK_URL;

const useReservationStore = create((set, get) => ({
  // state
  isLoading: false,
  checkInDate: null,
  checkOutDate: null,
  availablePackages: [],
  availableRooms: [],
  showPicker: false,
  tab: "room",
  popupAdultCount: 1,
  popupChildrenCount: 0,
  confirmedAdultCount: 1,
  confirmedChildrenCount: 0,
  isPopupVisible: false,
  sortingOrder: "",
  isSortingOpen: false,
  isSearchClicked: false,

  // actions
  setIsLoading: (isLoading) => set({ isLoading }),
  setDate: ({ startDate, endDate }) =>
    set({ checkInDate: startDate, checkOutDate: endDate }),
  setAvailablePackages: (packages) => set({ availablePackages: packages }),
  setAvailableRooms: (rooms) => set({ availableRooms: rooms }),
  togglePicker: () => set((state) => ({ showPicker: !state.showPicker })),
  setTab: (tab) => set({ tab }),

  togglePopup: () =>
    set((state) => {
      if (!state.isPopupVisible) {
        return {
          isPopupVisible: true,
          popupAdultCount: state.confirmedAdultCount,
          popupChildrenCount: state.confirmedChildrenCount,
        };
      }
      return { isPopupVisible: false };
    }),

  closePopup: () => set({ isPopupVisible: false }),

  handleConfirm: () =>
    set((state) => ({
      confirmedAdultCount: state.popupAdultCount,
      confirmedChildrenCount: state.popupChildrenCount,
      isPopupVisible: false,
    })),

  incrementCount: (type) =>
    set((state) => {
      if (type === "adult" && state.popupAdultCount < 2) {
        return { popupAdultCount: state.popupAdultCount + 1 };
      }
      if (type === "children" && state.popupChildrenCount < 3) {
        return { popupChildrenCount: state.popupChildrenCount + 1 };
      }
      return {};
    }),

  decrementCount: (type) =>
    set((state) => {
      if (type === "adult" && state.popupAdultCount > 1) {
        return { popupAdultCount: state.popupAdultCount - 1 };
      }
      if (type === "children" && state.popupChildrenCount > 0) {
        return { popupChildrenCount: state.popupChildrenCount - 1 };
      }
      return {};
    }),

  handleSortChange: (order) => set({ sortingOrder: order, isSortingOpen: false }),
  toggleSortingDropdown: () =>
    set((state) => ({ isSortingOpen: !state.isSortingOpen })),

  // 객실 예약 검색
  handleSearch: async () => {
    const { checkInDate, checkOutDate } = get();
    set({ isLoading: true, isSearchClicked: true });

    try {
      const response = await axios.post(bkURL + "/reserve", {
        startDate: checkInDate,
        endDate: checkOutDate,
      });

      if (response.status === 200) {
        const { availableRooms, availablePackages } = response.data;
        set({ availableRooms, availablePackages });
      }
    } catch (error) {
      console.error("예약 가능한 객실 조회 실패:", error.message);
      if (error.response) {
        console.error("서버 응답 오류:", error.response.data);
        console.error("서버 응답 상태:", error.response.status);
      } else if (error.request) {
        console.error("응답 없음:", error.request);
      } else {
        console.error("오류 발생:", error.message);
      }
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useReservationStore;

