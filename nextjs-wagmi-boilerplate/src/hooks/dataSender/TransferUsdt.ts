import { useWriteContract } from 'wagmi';
import { mock_usdt } from '@/utils/Environment';
import { MOCK_USDT_ABI } from '@/utils/MockUsdtAbi';

export function useUSDTTransfer() {
    const { writeContract, data: hash } = useWriteContract();

    const transferUSDT = async (toAddress: string, amountInWei: bigint) => {
        try {
            return writeContract({
                address: mock_usdt,
                abi: MOCK_USDT_ABI,
                functionName: 'transfer',
                args: [toAddress, amountInWei],
            });
        } catch (err) {
            console.error('Transfer failed:', err);
            throw err;
        }
    };
    
    return { transferUSDT, hash };
}