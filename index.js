// IMPORTATION
import { ethers } from "./ethers-5.1.esm.min.js";
import { abi, contractAddress } from "./constants.js";

// VARIABLES
const connectBtn = document.getElementById("connect-btn");
const fundBtn = document.getElementById("fund-btn");
const feedbackEl = document.getElementById("feedback-el");
const ethAmountInput = document.getElementById("eth-amount");
const balanceBtn = document.getElementById("balance-btn");
const withdrawBtn = document.getElementById("withdraw-btn");

// FUNCTIONS
function noMetamaskWarning() {
  console.log("Could not detect metamask");
}

function listenForTransactionMine(txResponse, provider) {
  return new Promise((resolve, reject) => {
    provider.once(txResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmation(s)`
      );
      resolve();
    });
  });
}

// ACTIONS
connectBtn.addEventListener("click", async () => {
  if (typeof window.ethereum !== "undefined") {
    window.ethereum.request({ method: "eth_requestAccounts" });
    window.ethereum.request({ method: "eth_requestAccounts" })
      ? console.log("Connected!!")
      : console.log("Could not connect, Try again");
  } else {
    noMetamaskWarning();
  }
});

fundBtn.addEventListener("click", async () => {
  if (typeof window.ethereum === "undefined") {
    const ethAmount = ethAmountInput.value;
    console.log(`Funding with ${ethAmount}ETH`);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const txResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      await listenForTransactionMine(txResponse, provider);
    } catch (error) {
      console.log(error);
    }
  }
});

balanceBtn.addEventListener("click", async () => {
  if (typeof window.ethereum !== "undefined") {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(contractAddress);
      console.log(`Balance: ${ethers.utils.formatEther(balance)}ETH`);
    } catch (error) {
      console.log(error);
    }
  }
});

withdrawBtn.addEventListener("click", async () => {
  if (typeof window.ethereum !== "undefined") {
    console.log("withdrawing...");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const txResponse = await contract.withdrawAll();
      await listenForTransactionMine(txResponse, provider);
    } catch (error) {
      console.log(error);
    }
  }
});
