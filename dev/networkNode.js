import express from "express";
import cors from "cors";
import Blockchain from "./blockchain.js";
import { v1 } from "uuid";
import axios from "axios";
import path from "path";

const port = process.argv[2];
const nodeAddress = v1().split("-").join("");
const bassacoin = new Blockchain();

var app = express();
app.use(cors());

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get("/blockchain", (req, res) => {
  res.send(bassacoin);
});

app.post("/transaction", (req, res) => {
  const newTransaction = req.body.newTransaction;

  const blockIndex =
    bassacoin.AddTransactionToPendingTransactions(newTransaction);

  res.json({ note: `Transaction will be added in block ${blockIndex}` });
});

app.post("/transaction/broadcast", async (req, res) => {
  var { amount, sender, recipient } = req.body;
  const newTransaction = bassacoin.createNewTransaction(
    amount,
    sender,
    recipient
  );

  bassacoin.AddTransactionToPendingTransactions(newTransaction);

  const regNodesPromises = [];
  bassacoin.networkNodes.forEach((networkNodeUrl) => {
    const url = networkNodeUrl + "/transaction";

    const requestOptions = axios.post(url, {
      newTransaction,
    });

    regNodesPromises.push(requestOptions);
  });

  await Promise.all(regNodesPromises);

  res.json({ note: "Transaction created and broadcast succesfully" });
});

app.get("/mine", async (req, res) => {
  const lastBlock = bassacoin.getLastBlock();
  const previousBlockHash = lastBlock["hash"];
  const currentBlockData = {
    transactions: bassacoin.pendingTransactions,
    index: lastBlock["index"] + 1,
    //poderíamos colocar outras chaves
  };

  const nonce = bassacoin.proofOfWork(previousBlockHash, currentBlockData);
  const blockHash = bassacoin.hashBlock(
    previousBlockHash,
    currentBlockData,
    nonce
  );

  const newBlock = bassacoin.createNewBlock(
    nonce,
    previousBlockHash,
    blockHash
  );

  const regNodesPromises = [];

  bassacoin.networkNodes.forEach((networkNodeUrl) => {
    const url = networkNodeUrl + "/receive-new-block";

    const requestOptions = axios.post(url, {
      newBlock: newBlock,
    });

    regNodesPromises.push(requestOptions);
  });

  try {
    await Promise.all(regNodesPromises);
  } catch (e) {
    console.log(e.message);
  }

  const urlTransaction = bassacoin.currentNodeUrl + "/transaction/broadcast";

  const dataTransaction = await axios.post(urlTransaction, {
    amount: 12.5,
    sender: "00",
    recipient: nodeAddress,
  });

  res.json({
    note: "New block mined & broadcasted successfully",
    block: newBlock,
  });
});

app.post("/receive-new-block", (req, res) => {
  const newBlock = req.body.newBlock;

  const lastBlock = bassacoin.getLastBlock();

  const correctHash = lastBlock.hash == newBlock.previousBlockHash;
  const correctIndex = lastBlock["index"] + 1 === newBlock["index"];

  if (correctHash && correctIndex) {
    bassacoin.chain.push(newBlock);
    bassacoin.pendingTransactions = [];
    res.json({
      note: "New block received and accepted",
      newBlock,
    });
  } else {
    res.json({
      note: "New block rejected",
      newBlock,
    });
  }
});

//register and broadcast it to the network
app.post("/register-and-broadcast-node", async (req, res) => {
  var { newNodeUrl } = req.body;

  if (bassacoin.networkNodes.indexOf(newNodeUrl) == -1) {
    bassacoin.networkNodes.push(newNodeUrl);

    const regNodesPromises = [];

    bassacoin.networkNodes.forEach((networkNodeUrl) => {
      const url = newNodeUrl + "/register-node";

      const requestOptions = axios.post(url, {
        newNodeUrl: networkNodeUrl,
      });

      regNodesPromises.push(requestOptions);
    });

    const data = await Promise.all(regNodesPromises);

    const urlBulk = newNodeUrl + "/register-nodes-bulk";

    const dataBulk = await axios.post(urlBulk, {
      allNetworkNodes: [...bassacoin.networkNodes, bassacoin.currentNodeUrl],
    });

    res.json({ note: "New node registred with network successfuly!" });
  } else {
    res.json({ note: "Already registred!" });
  }
});

//register node with the networks
app.post("/register-node", (req, res) => {
  var { newNodeUrl } = req.body;

  const nodeNotAlreadyPresent =
    bassacoin.networkNodes.indexOf(newNodeUrl) == -1;

  const notCurrentNode = bassacoin.currentNodeUrl !== newNodeUrl;

  if (nodeNotAlreadyPresent && notCurrentNode) {
    bassacoin.networkNodes.push(newNodeUrl);
  }

  res.json({ note: "New node registred successfully!" });
});

//register multiple nodes
app.post("/register-nodes-bulk", (req, res) => {
  var { allNetworkNodes } = req.body;

  allNetworkNodes.forEach((networkNodeUrl) => {
    const nodeNotAlreadyPresent =
      bassacoin.networkNodes.indexOf(networkNodeUrl) == -1;

    const notCurrentNode = bassacoin.currentNodeUrl !== networkNodeUrl;

    if (nodeNotAlreadyPresent && notCurrentNode) {
      bassacoin.networkNodes.push(networkNodeUrl);
    }
  });

  res.json({ note: "Bulk registration successful." });
});

app.get("/consensus", async (req, res) => {
  const regNodesPromises = [];

  bassacoin.networkNodes.forEach((networkNodeUrl) => {
    const url = networkNodeUrl + "/blockchain";

    const requestOptions = axios.get(url, {});

    regNodesPromises.push(requestOptions);
  });

  const blockchains = await Promise.all(regNodesPromises);

  const currentChainLength = bassacoin.chain.length;

  let maxChainLenth = currentChainLength;
  let newLongestChain = null;
  let newPendingTransactions = null;

  blockchains.forEach((blockchain) => {
    blockchain = blockchain.data;
    //do somenthing
    if (blockchain.chain.length > maxChainLenth) {
      maxChainLenth = blockchain.chain.length;
      newLongestChain = blockchain.chain;
      newPendingTransactions = blockchain.pendingTransactions;
    }
  });

  if (
    !newLongestChain ||
    (newLongestChain && !bassacoin.chainIsValid(newLongestChain))
  ) {
    res.json({
      note: "current chain has not been replaced",
      chain: bassacoin.chain,
    });
  } else if (newLongestChain && bassacoin.chainIsValid(newLongestChain)) {
    bassacoin.chain = newLongestChain;
    bassacoin.pendingTransactions = newPendingTransactions;
    res.json({
      note: "current chain has been replaced",
      chain: bassacoin.chain,
    });
  }
});

//4:42
app.get("/block/:blockHash", async (req, res) => {
  const { blockHash } = req.params;
  const correctBlock = bassacoin.getBlock(blockHash);

  res.json({
    block: correctBlock,
  });
});

app.get("/transaction/:transactionId", async (req, res) => {
  const { transactionId } = req.params;
  const { transaction, block } = bassacoin.getTransaction(transactionId);

  res.json({
    transaction,
    block,
  });
});

app.get("/address/:address", async (req, res) => {
  const { address } = req.params;
  const addressData = bassacoin.getAddressData(address);

  res.json({
    addressData,
  });
});

app.get("/block-explorer", (req, res) => {
  res.sendFile(path.resolve("dev/block-explorer/index.html"));
});

app.listen(port, () => {
  console.log(`Servidor rodando ${port}...`);
});
