export const trimAddress = (addr) => {
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
}

export const contract = {
  // 97: {
  //   // STAKE_ADDRESS: "0xd578bf8cc81a89619681c5969d99ea18a609c0c3",
  //   STAKE_ADDRESS: "0x556938AB392ca6B931798Ee0D72A8F834D344690",
  //   // MULTICALL_ADDRESS: "0x2cc8fe3e04d7b1edaeb42e2e73f78c4cac074116"
  //   MULTICALL_ADDRESS: "0xa54fe4a3dbd1eb21524cd73754666b7e13b4cb18"
  // },
  56: {
    // STAKE_ADDRESS: "0xd578bf8cc81a89619681c5969d99ea18a609c0c3",
    STAKE_ADDRESS: "0x5bBC2FC177695e9D506b56a16E1fBb4c0641A890",
    // MULTICALL_ADDRESS: "0x2cc8fe3e04d7b1edaeb42e2e73f78c4cac074116"
    MULTICALL_ADDRESS: "0x2cc8fe3e04d7b1edaeb42e2e73f78c4cac074116"
  },
  // 40627 : {
  //   // STAKE_ADDRESS: "0xd578bf8cc81a89619681c5969d99ea18a609c0c3",
  //   STAKE_ADDRESS: "0xb52c6f30CE21F95919dD9D9EF5f5BA12133c2921",
  //   // MULTICALL_ADDRESS: "0x2cc8fe3e04d7b1edaeb42e2e73f78c4cac074116"
  //   MULTICALL_ADDRESS: "0xf20eBb7472d41D2C4dC5d40319b8F39706538A8D"
  // }
  13308 : {
    // STAKE_ADDRESS: "0xd578bf8cc81a89619681c5969d99ea18a609c0c3",
    STAKE_ADDRESS: "0x92295eA5C293f7095408d128dad6dd08c8C7df22",
    STAKE_ADDRESS2: "0x8e7CE1df0655CB83e0B82A15EB8FaE8Ddfc8065A",
    // MULTICALL_ADDRESS: "0x2cc8fe3e04d7b1edaeb42e2e73f78c4cac074116"
    MULTICALL_ADDRESS: "0x6463cdc085BCEdf7138AAAD5adc96fc268e544d0"
  }
  
}

export const BSC_CHAIN_ID = 56;
export const CREDIT_CHAIN_ID = 13308;

export const BSC_STAKE_APY = [
  {
    apy: "10",
    time: "360"
  },
  {
    apy: "15",
    time: "540 "
  },
  {
    apy: "20",
    time: "720 "
  },
  {
    apy: "50",
    time: "1440"
  }
]

export const CREDIT_STAKE_APY = [
  {
    apy: "10",
    time: "360"
  },
  {
    apy: "15",
    time: "540 "
  },
  {
    apy: "20",
    time: "720 "
  },
  {
    apy: "50",
    time: "1440"
  }
]

export const CREDIT_STAKE_APY2 = [
  {
    apy: "15",
    time: "720"
  },
  {
    apy: "17",
    time: "1440"
  },
  {
    apy: "20",
    time: "1800"
  },
  {
    apy: "50",
    time: "3600"
  }
]

