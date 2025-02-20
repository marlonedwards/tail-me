import { ChatAnthropic } from "@langchain/anthropic";
import { MerkleClient, MerkleClientConfig } from "@merkletrade/ts-sdk";
import {
  Account,
  Aptos,
  Ed25519PrivateKey,
  Network,
  PrivateKey,
  PrivateKeyVariants,
} from "@aptos-labs/ts-sdk";
import { Message } from 'ai';
import { AIMessage, HumanMessage, ChatMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

const llm = new ChatAnthropic({
  temperature: 0.7,
  model: "claude-3-5-sonnet-latest",
  apiKey: "your-anthropic-key-here", // Replace with your actual key
});

export async function sendChatMessage(messages: Message[]) {
  try {
    // Initialize Merkle and Aptos configuration
    const merkle = new MerkleClient(await MerkleClientConfig.testnet());
    const aptos = new Aptos(merkle.config.aptosConfig);

    const PRIVATE_KEY = "APTOS-PRIVATE-KEY";

    const account = Account.fromPrivateKey({
      privateKey: new Ed25519PrivateKey(
        PrivateKey.formatPrivateKey(PRIVATE_KEY, PrivateKeyVariants.Ed25519),
      ),
    });

    const tools = {
      getBalance: async () => {
        const balance = await merkle.getUsdcBalance({
          accountAddress: account.accountAddress,
        });
        return Number(balance) / 1e6;
      },
      placeLongOrder: async (size: number, collateral: number) => {
        const openPayload = merkle.payloads.placeMarketOrder({
          pair: "BTC_USD",
          userAddress: account.accountAddress.toString(),
          sizeDelta: BigInt(size * 1e6),
          collateralDelta: BigInt(collateral * 1e6),
          isLong: true,
          isIncrease: true,
        });
        // Implementation of sendTransaction would go here
      },
    };

    const memory = new MemorySaver();

    const agent = createReactAgent({
      llm,
      tools,
      checkpointSaver: memory,
      messageModifier: `
        You are a helpful trading assistant that can help users trade on Merkle. You can:
        1. Check USDC balance
        2. Place long/short orders
        3. Manage positions
        
        Be concise and helpful. Always confirm details before executing trades.
        When dealing with amounts, always use proper decimal places (6 decimals for USDC).
      `,
    });

    const response = await agent.invoke({
      messages: messages.map(msg => 
        msg.role === 'user' 
          ? new HumanMessage(msg.content)
          : new AIMessage(msg.content)
      )
    });

    return response;

  } catch (error: any) {
    console.error("Chat error:", error);
    throw new Error(error instanceof Error ? error.message : "An error occurred");
  }
}

// Helper function to process transaction
async function sendTransaction(aptos: Aptos, account: Account, payload: any) {
  const transaction = await aptos.transaction.build.simple({
    sender: account.accountAddress,
    data: payload,
  });
  
  const { hash } = await aptos.signAndSubmitTransaction({
    signer: account,
    transaction,
  });
  
  return await aptos.waitForTransaction({ transactionHash: hash });
}