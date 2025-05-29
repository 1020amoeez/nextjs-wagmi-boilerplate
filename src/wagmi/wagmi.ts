import { http, cookieStorage, createConfig, createStorage } from 'wagmi'
import { arbitrum, base, mainnet } from 'wagmi/chains'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'

export function getConfig() {
  return createConfig({
    chains: [arbitrum, base, mainnet],
    connectors: [
      injected(),
      coinbaseWallet(),
      walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || '202a3d538b088d735b99722b0cea4910' }),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [arbitrum.id]: http(),
      [base.id]: http(),
      [mainnet.id]: http(),
    },
  })
}

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>
  }
}

export const config = createConfig({
  chains: [arbitrum, base, mainnet],
  transports: {
    [arbitrum.id]: http(),
    [base.id]: http(),
    [mainnet.id]: http(),
  },
})