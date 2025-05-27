import { useAccount, useConnect, useDisconnect, useSignMessage, useBalance } from 'wagmi'
import { useEffect, useState } from 'react'
import { useUSDTTransfer } from '@/hooks/dataSender/TransferUsdt'
import { parseUnits } from 'viem';


const ConnectWallet = () => {
  const account = useAccount()
  const [amount, setAmount] = useState<string>("");
  const [toAddress, setToAddress] = useState<string>("");
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()
  const { signMessage, data: signData, error: signError, reset: resetSignMessage } = useSignMessage()
  const { data: balance } = useBalance({ address: account?.address, chainId: account?.chain?.id })
  const { transferUSDT, hash } = useUSDTTransfer();

  const handleTransferUsdt = async () => {
    if (!toAddress || !amount) {
      alert('Please fill in both address and amount');
      return;
    }
    try {
      const amountInWei = parseUnits(amount.toString(), 6);
      await transferUSDT(toAddress, amountInWei);
      setToAddress("")
      setAmount("")
    } catch (err) {
      console.error('Transaction failed:', err);
    }
  };

  useEffect(() => {
    if (!account.isConnected) {
      resetSignMessage()
      localStorage.removeItem('signed')
    }
  }, [account.isConnected, resetSignMessage])

  useEffect(() => {
    const hasSigned = localStorage.getItem('signed')
    if (
      account.isConnected &&
      !signData &&
      !signError &&
      !hasSigned
    ) {
      signMessage({ message: 'hello world' })
    }
  }, [account.isConnected, account.address, signData, signError, signMessage])

  useEffect(() => {
    if (signData && account.address) {
      localStorage.setItem('signed', signData)
    }
  }, [signData, account.address])

  const handleDisconnect = () => {
    localStorage.removeItem('signed')
    resetSignMessage()
    disconnect()
  }

  return (
    <>
      <div>
        <h2>Account</h2>
        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          balance: {balance?.formatted}
          <br />
          chainId: {account.chainId}
        </div>
        {account.status === 'connected' && (
          <button type="button" onClick={handleDisconnect}>
            Disconnect
          </button>
        )}
      </div>
      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
      </div>
      <button onClick={() => signMessage({ message: 'hello world' })}>
        Sign Manually (Optional)
      </button>
      {signData && <div>Signature: {signData}</div>}
      {signError && <div>{"User rejected the transaction !!"}</div>}
      <div>
        <h2>Transfer Mock Usdt</h2>
        <div>
          <input
            type="text"
            placeholder="Recipient Address"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            style={{ width: '500px', height: '20px', fontSize: '16px', padding: '8px' }}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ width: '200px', height: '20px', fontSize: '16px', padding: '8px', marginTop: "10px" }}
          />
        </div>
        <button
          style={{ marginTop: "10px" }}
          onClick={handleTransferUsdt}
        >
          Send transaction
        </button>
        {hash && <div>Transaction Hash: {hash}</div>}
        {error && <div>Error: {error.message}</div>}
      </div>
    </>
  )
}

export default ConnectWallet