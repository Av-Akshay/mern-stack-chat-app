import { useEffect, useState } from "react";

const useLocalStorageData = () => {
  const [localData, setLocalData] = useState({});
  useEffect(() => {
    const localStorageData = JSON.parse(localStorage.getItem("userInfo"));
    setLocalData(localStorageData);
  }, []);
  return {
    localData,
  };
};

export default useLocalStorageData;
