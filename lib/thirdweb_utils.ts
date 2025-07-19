import { inAppWallet } from 'thirdweb/wallets'
import { createThirdwebClient } from 'thirdweb'
import { env_vars } from '@/lib/env_vars'

export const client = createThirdwebClient({
  clientId: env_vars.THIRD_WEB_CLIENT_ID,
  secretKey: env_vars.THIRD_WEB_SECRET_KEY,
})

export const wallets = [
  inAppWallet({
    // available auth methods
    auth: { options: ['wallet', 'google', 'discord', 'github', 'email', 'telegram'] },
    // app metadata
    metadata: {
      name: 'FlashLink',
      // image: {
      //   src: 'https://example.com/banner.png',
      //   width: 100,
      //   height: 100,
      // },
    },
    // enable gasless transactions for the wallet
    executionMode: {
      mode: 'EIP7702',
      sponsorGas: true,
    },
  }),
]
