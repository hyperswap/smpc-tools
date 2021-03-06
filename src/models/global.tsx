import { nodeListService } from "@/api";
import config from "@/config";
import { reducer } from "@/utils";
import { useEffect, useReducer } from "react";
import moment from "moment";

const initState = {
  address: "",
  loginAccount: {
    rpc: "",
    enode: "",
    signEnode: "",
  },
  nodeList: [],
  isDay:
    moment().format("YYYY-MM-DD HH:mm:ss") <
      moment().format("YYYY-MM-DD 21:00:00") &&
    moment().format("YYYY-MM-DD HH:mm:ss") >
      moment().format("YYYY-MM-DD 05:30:00"),
};

export default function Index() {
  const [state, dispatch] = useReducer(reducer, initState);

  const getNodeList = async () => {
    const res = await nodeListService();
    dispatch({
      nodeList: res.info,
    });
  };

  useEffect(() => {
    // '/nodes/list'
    getNodeList();
  }, []);

  return { ...state, globalDispatch: dispatch };
}
