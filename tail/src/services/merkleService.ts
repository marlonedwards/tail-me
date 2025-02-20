import { MerkleClient, MerkleClientConfig, Position, PairState, InputEntryFunctionData } from "@merkletrade/ts-sdk";
import { Aptos, AccountAddress, Network, AptosConfig } from "@aptos-labs/ts-sdk";
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MerkleService {
    private merkle!: MerkleClient;
    private aptos!: Aptos;
    
    constructor() {
      this.initialize();
    }
  
    private async initialize() {
      try {
        this.merkle = new MerkleClient(await MerkleClientConfig.testnet());
        const config = new AptosConfig({ network: Network.TESTNET });
        this.aptos = new Aptos(config);
      } catch (error) {
        console.error('Error initializing Merkle service:', error);
        throw error;
      }
    }

    private async sendTransaction(payload: InputEntryFunctionData, sender: string) {
      try {
        const address = AccountAddress.from(sender);
        const transaction = await this.aptos.transaction.build.simple({
          sender: address,
          data: payload,
        });
        return transaction;
      } catch (error) {
        console.error('Error building transaction:', error);
        throw error;
      }
    }

    async getUsdcBalance(userAddress: string) {
      try {
        const address = AccountAddress.from(userAddress);
        const balance = await this.merkle.getUsdcBalance({
          accountAddress: address,
        });
        return balance;
      } catch (error) {
        console.error('Error fetching USDC balance:', error);
        return BigInt(0);
      }
    }

    async requestTestUSDC(userAddress: string) {
      try {
        const address = AccountAddress.from(userAddress);
        const payload = await this.merkle.payloads.testnetFaucetUSDC({
          userAddress: address.toString() as `0x${string}`,
          amount: 10_000_000n // Request 10 USDC (6 decimals)
        });

        return this.sendTransaction(payload, userAddress);
      } catch (error) {
        console.error("Error requesting test USDC:", error);
        throw error;
      }
    }

    async placeMarketOrder(
      userAddress: string,
      params: {
        pair: string;
        sizeDelta: bigint;
        collateralDelta: bigint;
        isLong: boolean;
        isIncrease: boolean;
      }
    ) {
      try {
        const address = AccountAddress.from(userAddress);
        
        const payload = await this.merkle.payloads.placeMarketOrder({
          pair: params.pair,
          userAddress: address.toString() as `0x${string}`,
          sizeDelta: params.sizeDelta,
          collateralDelta: params.collateralDelta,
          isLong: params.isLong,
          isIncrease: params.isIncrease,
        });
  
        return this.sendTransaction(payload, userAddress);
      } catch (error) {
        console.error('Error creating market order payload:', error);
        throw error;
      }
    }  

    async getPositions(userAddress: string) {
      try {
        const positions = await this.merkle.getPositions({
          address: userAddress as `0x${string}`
        });
        
        return positions.map(pos => ({
          pair: pos.market,
          size: pos.size,
          collateral: pos.collateral,
          isLong: pos.isLong,
          pairType: pos.market
        }));
      } catch (error) {
        console.error('Error fetching positions:', error);
        return [];
      }
    }

    async findPosition(userAddress: string, pair: string) {
      try {
        const positions = await this.getPositions(userAddress);
        return positions.find((position) => position.pair === pair);
      } catch (error) {
        console.error('Error finding position:', error);
        return null;
      }
    }

    async closePosition(userAddress: string, pair: string) {
      try {
        const position = await this.findPosition(userAddress, pair);
        if (!position) {
          throw new Error(`${pair} position not found`);
        }

        const payload = await this.merkle.payloads.placeMarketOrder({
          pair,
          userAddress: userAddress as `0x${string}`,
          sizeDelta: position.size,
          collateralDelta: position.collateral,
          isLong: position.isLong,
          isIncrease: false,
        });

        return this.sendTransaction(payload, userAddress);
      } catch (error) {
        console.error('Error closing position:', error);
        throw error;
      }
    }

    async getPairState(pair: string) {
      if (!pair) {
        console.error('Error: Pair is undefined');
        return null;
      }
      try {
        const pairState = await this.merkle.getPairState({ pairId: pair });
        return {
          ...pairState,
          price: Number(pairState.markPrice) / 1e6 // Convert to human readable format
        };
      } catch (error) {
        console.error('Error fetching pair state:', error);
        return null;
      }
    }
}

export const merkleService = new MerkleService();