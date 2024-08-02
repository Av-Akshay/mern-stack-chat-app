import { useNavigate, Navigate } from "react-router-dom";
import useLocalStorageData from "../hooks/useLocalStorageData";

const PrivateRouting = ({ Children }) => {
  const { localData } = useLocalStorageData();

  const navigate = useNavigate();
  console.log(localData);
  return localData ? Children : <Navigate to="/" />;
};

export default PrivateRouting;
