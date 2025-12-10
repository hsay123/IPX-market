import { ethers } from "ethers"

/**
 * Convert a string to bytes32 hash
 * Used to create dataHash for DataVaultPay contract
 */
export function toBytes32(s: string): string {
  return ethers.id(s)
}

/**
 * Ensure the correct chain (Story Aeneid 1315) is connected
 */
export async function ensureCorrectChain(ethereum: any): Promise<boolean> {
  const AENEID_CHAIN_ID = "0x523" // 1315 in hex

  try {
    const currentChainId = await ethereum.request({ method: "eth_chainId" })

    if (currentChainId !== AENEID_CHAIN_ID) {
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: AENEID_CHAIN_ID }],
        })
        return true
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          // Chain not added, add it
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: AENEID_CHAIN_ID,
                chainName: "Story Aeneid Testnet",
                nativeCurrency: {
                  name: "IP",
                  symbol: "IP",
                  decimals: 18,
                },
                rpcUrls: [process.env.NEXT_PUBLIC_AENEID_RPC || "https://aeneid.storyrpc.io"],
                blockExplorerUrls: [process.env.NEXT_PUBLIC_STORYSCAN || "https://aeneid.storyscan.io"],
              },
            ],
          })
          return true
        }
        throw switchError
      }
    }
    return true
  } catch (error) {
    console.error("[v0] Chain switch error:", error)
    throw error
  }
}

/**
 * Execute contract purchase directly on blockchain
 * No backend verification needed - blockchain is self-verifying
 */
export async function executePurchase(
  ethereum: any,
  account: string,
  itemId: number,
  itemTitle: string,
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    const contractAddress = process.env.NEXT_PUBLIC_PAY_CONTRACT?.trim()

    if (!contractAddress || contractAddress === "") {
      throw new Error("Contract address not configured")
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
      throw new Error(`Invalid contract address format: ${contractAddress}`)
    }

    // Ensure correct chain
    await ensureCorrectChain(ethereum)

    // Create ethers provider and signer
    const provider = new ethers.BrowserProvider(ethereum)
    const signer = await provider.getSigner()

    // Import contract ABI
    const ABI = [
      {
        inputs: [{ internalType: "bytes32", name: "dataHash", type: "bytes32" }],
        name: "recordAction",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
    ]

    // Create contract instance
    const contract = new ethers.Contract(contractAddress, ABI, signer)

    // Generate dataHash from item information
    const dataHash = toBytes32(`${itemId}:${itemTitle}:${Date.now()}`)

    console.log("[v0] Calling recordAction with dataHash:", dataHash)

    // Send transaction - 0.001 IP
    const tx = await contract.recordAction(dataHash, {
      value: ethers.parseEther("0.001"),
    })

    console.log("[v0] Transaction submitted:", tx.hash)

    // Wait for confirmation (1 block usually enough)
    const receipt = await tx.wait(1)

    console.log("[v0] Transaction confirmed:", receipt?.transactionHash)

    if (receipt?.status === 0) {
      throw new Error("Transaction reverted on-chain")
    }

    return {
      success: true,
      txHash: tx.hash,
    }
  } catch (error: any) {
    console.error("[v0] Purchase execution error:", error)

    // Parse error messages
    let errorMsg = error.message || "Unknown error"

    if (error.code === 4001) {
      errorMsg = "Transaction rejected by user"
    } else if (error.code === "INSUFFICIENT_FUNDS") {
      errorMsg = "Insufficient IP tokens in wallet"
    } else if (error.reason) {
      errorMsg = error.reason
    }

    return {
      success: false,
      error: errorMsg,
    }
  }
}
