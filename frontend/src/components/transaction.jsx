import {
  WalletAdapterNetwork,
  WalletNotConnectedError,
} from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import {
  clusterApiUrl,
  Transaction,
  SystemProgram,
  PublicKey,
  LAMPORTS_PER_SOL,
  Connection,
} from "@solana/web3.js";

import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import React, {
  useMemo,
  useCallback,
  useState,
  useEffect,
  useContext,
} from "react";
import "tailwindcss/tailwind.css";

import "@solana/wallet-adapter-react-ui/styles.css";
import { AuthContext } from "../context/auth";
import axios from "axios";

let thelamports = 0;
let theWallet = "9m5kFDqgpf7Ckzbox91RYcADqcmvxW4MmuNvroD5H2r9";

const Transactions = ({ closeModal }) => {
  return (
    <Context>
      <Content closeModal={closeModal} />
    </Context>
  );
};

export default Transactions;

const Context = ({ children }) => {
  const network = WalletAdapterNetwork.Testnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new LedgerWalletAdapter(),
      new PhantomWalletAdapter(),

      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const Content = ({ closeModal }) => {
  const { auth } = useContext(AuthContext);
  const [lamports, setLamports] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post(
          "https://x-ploit-backend-4.onrender.com/api/get-profile",
          { profileId: auth?.user?._id }
        );
        const userData = response.data;
        console.log("fetched wallet and user profile", userData);
        setUserProfile(userData);
        if (userData.wallet) {
          setWalletAddress(userData.wallet);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    if (auth?.user?._id) {
      fetchUserData();
    }
  }, [auth]);

  const [wallet, setWallet] = useState(walletAddress);

  const connection = new Connection(clusterApiUrl("testnet"));
  const { publicKey, sendTransaction } = useWallet();

  const onClick = useCallback(async () => {
    if (!publicKey) throw new WalletNotConnectedError();

    connection.getBalance(publicKey).then((bal) => {
      console.log(bal / LAMPORTS_PER_SOL);
    });

    let lamportsI = LAMPORTS_PER_SOL * lamports;
    console.log(publicKey.toBase58());
    console.log("lamports sending: {}", thelamports);
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(theWallet),
        lamports: lamportsI,
      })
    );

    const signature = await sendTransaction(transaction, connection);
    await connection.confirmTransaction(signature, "processed");
  }, [publicKey, sendTransaction, connection, lamports]);

  function setTheLamports(e) {
    console.log(Number(e.target.value));
    setLamports(Number(e.target.value));
    thelamports = Number(e.target.value);
  }

  function setTheWallet(e) {
    setWallet(e.target.value);
    theWallet = e.target.value;
  }

  return (
    <div className="App">
      <ul className="flex space-x-4">
        <li>
          <WalletMultiButton />
        </li>
      </ul>

      <div className="flex flex-col  mt-10 items-start justify-start">
        <p className="text-black">Receiver :</p>
        <input
          value={wallet}
          type="text"
          onChange={setTheWallet}
          className="mb-4 p-2 border border-gray-300 rounded text-black"
        />
        <p className="text-black">Amount :</p>
        <input
          value={lamports}
          type="number"
          onChange={setTheLamports}
          className="mb-4 p-2 border border-gray-300 rounded text-black"
        />

        <div className="flex space-x-4">
          <button
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mt-4 "
            onClick={onClick}
          >
            Send Sol
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
