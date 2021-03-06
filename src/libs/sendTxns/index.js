import { mmWeb3 } from "@/libs/wallet/metamask.js";
import { toSign } from "@/libs/wallet/ledger/index.js";
import { getBaseInfo } from "@/libs/web3/web3Utils.js";

function mmSendTxns(rawTx) {
  let data = { msg: "Error", error: "Error" };
  return new Promise((resolve) => {
    let params = {
      method: "eth_sendTransaction",
      params: [rawTx],
      from: rawTx.from, // Provide the user's account to use.
    };
    mmWeb3.sendAsync(params, (err, res) => {
      if (err) {
        data = { msg: "Error", error: "The transaction failed!" };
      } else {
        data = { msg: "Success", info: res.result };
      }
      resolve(data);
    });
  });
}

function hdSendTxns(rawTx, HDpath) {
  let data = { msg: "Error", error: "Error" };
  return new Promise((resolve) => {
    toSign(HDpath, rawTx).then((res) => {
      if (res.msg === "Success") {
        web3Fn.eth.sendSignedTransaction(res.info.signedTx, (err, hash) => {
          if (err) {
            data = { msg: "Error", error: "The transaction failed!" };
          } else {
            data = { msg: "Success", info: hash };
          }
          resolve(data);
        });
      } else {
        data = { msg: "Error", error: "Sign Error!" };
        resolve(data);
      }
    });
  });
}

function sendTxns(params) {
  let data = { msg: "Error", error: "Error" };
  return new Promise((resolve) => {
    getBaseInfo(params).then((res) => {
      if (res.msg === "Success") {
        let rawTx = {
          ...res.info,
          from: params.from,
        };
        console.log(rawTx);
        if (params.loginType === "METAMASK") {
          mmSendTxns(rawTx).then((results) => {
            resolve(results);
          });
        } else if (params.loginType === "LEDGER") {
          hdSendTxns(rawTx, params.HDpath).then((results) => {
            resolve(results);
          });
        } else {
          resolve(data);
        }
      } else {
        resolve(data);
      }
    });
  });
}

export { sendTxns };
