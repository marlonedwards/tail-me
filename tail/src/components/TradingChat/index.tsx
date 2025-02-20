import { useState, useEffect, useRef } from 'react';
import { MerkleClient, MerkleClientConfig } from "@merkletrade/ts-sdk";
import {
  Account,
  Aptos,
  Ed25519PrivateKey,
  Network,
  PrivateKey,
  PrivateKeyVariants,
  type InputEntryFunctionData,
} from "@aptos-labs/ts-sdk";
import { Message } from 'ai';
import { sendChatMessage } from '../../services/api/chat';

export default function TradingChat() {
  const [merkleClient, setMerkleClient] = useState<MerkleClient | null>(null);
  const [aptosClient, setAptosClient] = useState<Aptos | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Replace useChat with custom state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initializeClients = async () => {
      try {
        const merkle = new MerkleClient(await MerkleClientConfig.testnet());
        const aptos = new Aptos(merkle.config.aptosConfig);
        
        const PRIVATE_KEY = "YOUR-APTOS-PRIV-KEY";
        const acc = Account.fromPrivateKey({
          privateKey: new Ed25519PrivateKey(
            PrivateKey.formatPrivateKey(PRIVATE_KEY, PrivateKeyVariants.Ed25519),
          ),
        });

        setMerkleClient(merkle);
        setAptosClient(aptos);
        setAccount(acc);

        // Add initial system message
        setMessages([{
          role: 'assistant',
          content: "Hello! I'm your AI trading assistant. I can help you place trades, check balances, and manage your positions on Merkle. What would you like to do?",
        }]);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize clients');
      }
    };

    initializeClients();
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendTransaction = async (payload: InputEntryFunctionData) => {
    if (!aptosClient || !account) throw new Error('Clients not initialized');
    
    const transaction = await aptosClient.transaction.build.simple({
      sender: account.accountAddress,
      data: payload,
    });
    
    const { hash } = await aptosClient.signAndSubmitTransaction({
      signer: account,
      transaction,
    });
    
    return await aptosClient.waitForTransaction({ transactionHash: hash });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (!merkleClient || !account) {
      setError('Trading clients not initialized');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Add user message
      const userMessage: Message = { role: 'user', content: input };
      setMessages(prev => [...prev, userMessage]);
      setInput('');

      // Get AI response
      const response = await sendChatMessage([...messages, userMessage]);
      
      if (response) {
        const assistantMessage: Message = { 
          role: 'assistant', 
          content: response.content 
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="flex flex-col h-[600px] max-w-3xl mx-auto p-4 bg-gray-50 rounded-lg shadow">
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto mb-4 space-y-4 p-4"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              message.role === 'user' 
                ? 'bg-blue-100 ml-auto' 
                : message.role === 'assistant'
                ? 'bg-gray-100'
                : 'bg-green-100'
            } max-w-[80%]`}
          >
            <div className="font-bold mb-1">
              {message.role === 'user' ? 'You' : 'Assistant'}:
            </div>
            <div className="whitespace-pre-wrap">{message.content}</div>
          </div>
        ))}
        
        {error && (
          <div className="p-4 rounded-lg bg-red-100 text-red-700">
            Error: {error}
          </div>
        )}
      </div>
      
      <form onSubmit={handleFormSubmit} className="flex gap-2 p-2 border-t">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Ask me about trading..."
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}