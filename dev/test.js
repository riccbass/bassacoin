import Blockchain from "./blockchain.js";
const bassacoin = new Blockchain();

const bc1 = {
  chain: [
    {
      index: 1,
      timestamp: 1648224701099,
      transactions: [],
      nonce: 100,
      hash: "0",
      previousBlockHash: "0",
    },
    {
      index: 2,
      timestamp: 1648224728016,
      transactions: [],
      nonce: 18140,
      hash: "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
      previousBlockHash: "0",
    },
    {
      index: 3,
      timestamp: 1648224732532,
      transactions: [
        {
          amount: 12.5,
          sender: "00",
          recipient: "41b1f7b0ac5611eca488db6f1156fe12",
          transactionId: "51c98910ac5611eca488db6f1156fe12",
        },
      ],
      nonce: 53211,
      hash: "0000cb8ddaeb69115c3a3a544e809e919a6580876fa2ec9fcbb0a410c0ef6f34",
      previousBlockHash:
        "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
    },
    {
      index: 4,
      timestamp: 1648224737795,
      transactions: [
        {
          amount: 12.5,
          sender: "00",
          recipient: "41b1f7b0ac5611eca488db6f1156fe12",
          transactionId: "5470b440ac5611eca488db6f1156fe12",
        },
      ],
      nonce: 110746,
      hash: "00001598195e3e9b6812a854005aecc2fb70dd3fe415b92a019cb1dd914f79b2",
      previousBlockHash:
        "0000cb8ddaeb69115c3a3a544e809e919a6580876fa2ec9fcbb0a410c0ef6f34",
    },
    {
      index: 5,
      timestamp: 1648224743053,
      transactions: [
        {
          amount: 12.5,
          sender: "00",
          recipient: "41b1f7b0ac5611eca488db6f1156fe12",
          transactionId: "579329f0ac5611eca488db6f1156fe12",
        },
      ],
      nonce: 128455,
      hash: "00000bfa9b29173a132f9ca39546e289fbea5746f3a749a7599c357522ad06b3",
      previousBlockHash:
        "00001598195e3e9b6812a854005aecc2fb70dd3fe415b92a019cb1dd914f79b2",
    },
    {
      index: 6,
      timestamp: 1648224799976,
      transactions: [
        {
          amount: 12.5,
          sender: "00",
          recipient: "41b1f7b0ac5611eca488db6f1156fe12",
          transactionId: "5ab57890ac5611eca488db6f1156fe12",
        },
        {
          amount: 1000,
          sender: "ASFAFFsfdSGASFAFAS",
          recipient: "ADFASF23213123ERSAF",
          transactionId: "60e925e0ac5611eca488db6f1156fe12",
        },
        {
          amount: 10,
          sender: "ASFAFFsfdSGASFAFAS",
          recipient: "ADFASF23213123ERSAF",
          transactionId: "63aeae80ac5611eca488db6f1156fe12",
        },
        {
          amount: 510 ,
          sender: "ASFAFFsfdSGASFAFAS",
          recipient: "ADFASF23213123ERSAF",
          transactionId: "662309e0ac5611eca488db6f1156fe12",
        },
      ],
      nonce: 11154,
      hash: "000027d004ef484452199e03ca69c00d695e41371399ce8d43c62e08adcbef38",
      previousBlockHash:
        "00000bfa9b29173a132f9ca39546e289fbea5746f3a749a7599c357522ad06b3",
    },
    {
      index: 7,
      timestamp: 1648224938407,
      transactions: [
        {
          amount: 12.5,
          sender: "00",
          recipient: "41b1f7b0ac5611eca488db6f1156fe12",
          transactionId: "7ca7f630ac5611eca488db6f1156fe12",
        },
      ],
      nonce: 51875,
      hash: "0000c417fe33625a02aa98dbdd53d1284065406e6c4c2b67f074541c38481500",
      previousBlockHash:
        "000027d004ef484452199e03ca69c00d695e41371399ce8d43c62e08adcbef38",
    },
    {
      index: 8,
      timestamp: 1648224939650,
      transactions: [
        {
          amount: 12.5,
          sender: "00",
          recipient: "41b1f7b0ac5611eca488db6f1156fe12",
          transactionId: "cf269560ac5611eca488db6f1156fe12",
        },
      ],
      nonce: 13998,
      hash: "0000b9a5a1b033f97fa810116a436a1de978e01e8ac0110915b323e8fcd309cb",
      previousBlockHash:
        "0000c417fe33625a02aa98dbdd53d1284065406e6c4c2b67f074541c38481500",
    },
  ],
  pendingTransactions: [
    {
      amount: 12.5,
      sender: "00",
      recipient: "41b1f7b0ac5611eca488db6f1156fe12",
      transactionId: "cfe41900ac5611eca488db6f1156fe12",
    },
  ],
  currentNodeUrl: "http://localhost:3001",
  networkNodes: [],
};

console.log(bassacoin.chainIsValid(bc1.chain));
