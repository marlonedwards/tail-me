import { Link } from 'react-router-dom';
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const Navbar = () => {
  const { connect, account, disconnect } = useWallet();

  const handleConnect = () => {
    connect("Petra");
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-gray-900">
              Tail Me
            </Link>
            <Link to="/portfolio" className="text-gray-600 hover:text-gray-900">
              Portfolio
            </Link>
          </div>
          
          <div>
            {account ? (
              <button
                onClick={() => disconnect()}
                className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200"
              >
                {account.address.slice(0, 6)}...{account.address.slice(-4)}
              </button>
            ) : (
              <button
                onClick={handleConnect}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;