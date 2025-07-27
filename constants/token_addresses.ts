export const tokenAddresses = {
  ETH: '0x3A9D48AB9751398BbFa63ad67599Bb04e4BdF98b',
  WETH: '0x5cfB5e2CddbC83c95323F86eBfe612E3d82797d1',
  // USDT: '0xe51a000603fBB1c3Fa64fA750481655A56d66f78',
  USDT: '0x6F877D40d8af9A4CDA5802505B7721A6c209A8E1',
  USDC: '0x64BcbDa6d48031FA23B362809B651CD9144cb62d', // USD Coin
  DAI: '0x5B1fd21df873E66B4Fc83D6FDc62041eC55c07c5', // DAI stablecoin
  WBTC: '0x4faDa63e1C589fEa33c73f027036d8c01e737c07', // Wrapped BTC
  LINK: '0x779877A7B0D9E8603169DdbD7836e478b4624789', // Chainlink LINK
  UNI: '0x492E85cD024A271C4F19d8b7e9050Ef2bbFeDcCA', // Uniswap UNI
  AAVE: '0x5bb220afc6e2e008cb2302a83536a019ed245aa2', // Aave AAVE
  COMP: '0x203c27b0949edaa0068e27393fd2645475cb62d0', // Compound COMP
  MKR: '0x2579a429bdd3ed5ac1e78bbb3f72b5db5deae148', // Maker MKR

  WXTZ: '0x2a69655c22eda32ff48d315bb26ed45f150700b4', // Wrapped Tezos on Ethereum
}

export interface TokenOption {
  value: string
  label: string
  symbol: string
  icon: string
  address: string
}

export const tokenOptionsTestnet: TokenOption[] = [
  // {
  //   value: 'ETH',
  //   label: 'ETH Sepolia',
  //   symbol: 'ETH',
  //   icon: 'https://cryptoicons.org/api/icon/dai/200',
  //   address: '0x3A9D48AB9751398BbFa63ad67599Bb04e4BdF98b',
  // },
  {
    value: 'WETH',
    label: 'Wrapped ETH',
    symbol: 'WETH',
    icon: 'https://cryptoicons.org/api/icon/dai/200',
    address: '0x5cfB5e2CddbC83c95323F86eBfe612E3d82797d1',
  },
  {
    value: 'USDT',
    label: 'Tether USD',
    symbol: 'USDT',
    icon: 'https://cryptoicons.org/api/icon/usdt/200',
    address: '0x6F877D40d8af9A4CDA5802505B7721A6c209A8E1',
  },
  {
    value: 'USDC',
    label: 'USD Coin',
    symbol: 'USDC',
    icon: 'https://cryptoicons.org/api/icon/usdc/200',
    address: '0x64BcbDa6d48031FA23B362809B651CD9144cb62d',
  },
  {
    value: 'DAI',
    label: 'Dai',
    symbol: 'DAI',
    icon: 'https://cryptoicons.org/api/icon/dai/200',
    address: '0x5B1fd21df873E66B4Fc83D6FDc62041eC55c07c5',
  },
  // {
  //   value: 'WETH',
  //   label: 'Wrapped Ether',
  //   symbol: 'WETH',
  //   icon: 'https://cryptoicons.org/api/icon/eth/200',
  //   address: '0x7b79995e5f793a07Bc00c21412e50Ecae098e7f9',
  // },
  {
    value: 'WBTC',
    label: 'Wrapped Bitcoin',
    symbol: 'WBTC',
    icon: 'https://cryptoicons.org/api/icon/wbtc/200',
    address: '0x4faDa63e1C589fEa33c73f027036d8c01e737c07',
  },
  // {
  //   value: 'LINK',
  //   label: 'Chainlink',
  //   symbol: 'LINK',
  //   icon: 'https://cryptoicons.org/api/icon/link/200',
  //   address: '0x779877A7B0D9E8603169DdbD7836e478b4624789',
  // },
  // {
  //   value: 'UNI',
  //   label: 'Uniswap',
  //   symbol: 'UNI',
  //   icon: 'https://cryptoicons.org/api/icon/uni/200',
  //   address: '0x492E85cD024A271C4F19d8b7e9050Ef2bbFeDcCA',
  // },
  // {
  //   value: 'AAVE',
  //   label: 'Aave',
  //   symbol: 'AAVE',
  //   icon: 'https://cryptoicons.org/api/icon/aave/200',
  //   address: '0x5bb220afc6e2e008cb2302a83536a019ed245aa2',
  // },
  // {
  //   value: 'COMP',
  //   label: 'Compound',
  //   symbol: 'COMP',
  //   icon: 'https://cryptoicons.org/api/icon/comp/200',
  //   address: '0xd3b4ebc177cef4da4e213b95ee09b23ee8a2e303',
  // },
  // {
  //   value: 'MKR',
  //   label: 'Maker',
  //   symbol: 'MKR',
  //   icon: 'https://cryptoicons.org/api/icon/mkr/200',
  //   address: '0x2579a429bdd3ed5ac1e78bbb3f72b5db5deae148',
  // },
]
