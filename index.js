// Import Solana web3 functinalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    sendAndConfirmRawTransaction,
    sendAndConfirmTransaction
} = require("@solana/web3.js");

const DEMO_FROM_SECRET_KEY = new Uint8Array(
    [
        174,  70, 112, 164, 147,  40, 218, 118, 150, 167, 197,
        139, 163,  36,  58, 129,  45, 246,  85, 255,  93, 156,
         23, 144, 248, 159, 114,  75, 211,  84,  69, 234,  23,
        206, 248,  31, 231,  49, 130, 242, 168, 123,  24, 240,
        160, 167,  45,  41, 172, 114, 191,  30, 114, 187, 173,
        252,  39,  56, 217,  41,  12, 224, 152, 208
      ]            
);

const transferSol = async() => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    // Get Keypair from Secret Key
    var from = Keypair.fromSecretKey(DEMO_FROM_SECRET_KEY);

    // Generate another Keypair (account we'll be sending to)
    const to = Keypair.generate();

// Get from Sender Balance and Log Balance
const getWalletBalance = async(publicAddress) => {
    try {
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const solWallet = new PublicKey(publicAddress);
        const walletBalance = await connection.getBalance(
            solWallet
        ); 
        return walletBalance / LAMPORTS_PER_SOL;
            
        } catch (error) {
        console.error(error);
        }
    }
    var fromWalletBalance = await getWalletBalance(from.publicKey);
    var halfBalance = (fromWalletBalance * LAMPORTS_PER_SOL) / 2;

    console.log('from Wallet balance:', await getWalletBalance(from.publicKey), 'SOL');
    console.log('to Wallet balance:', await getWalletBalance(to.publicKey), 'SOL');

    // From Challenge2 - Lesson 1
    // Aidrop 2 SOL to Sender wallet
    //  console.log("Airdopping some SOL to Sender wallet!");
    // const fromAirDropSignature = await connection.requestAirdrop(
       //  new PublicKey(from.publicKey),
       //  2 * LAMPORTS_PER_SOL
   // );

    // Latest blockhash (unique identifer of the block) of the cluster
    //let latestBlockHash = await connection.getLatestBlockhash();

    // Confirm transaction using the last valid block height (refers to its time)
    // to check for transaction expiration
   // await connection.confirmTransaction({
      //  blockhash: latestBlockHash.blockhash,
      //  lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      //  signature: from.publicKey
   // });

   // console.log("Airdrop completed for the Sender account");
   //  console.log('from Wallet balance:', await getWalletBalance(from.publicKey), 'SOL');
   //  console.log('to Wallet balance:', await getWalletBalance(to.publicKey), 'SOL');

    // Send money from "from" wallet and into "to" wallet
    var transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to.publicKey,
            lamports: halfBalance
        })

    );

    // Sign transaction
    var signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [from]
    );

    console.log('Signature is ', signature);
    console.log('from Wallet balance:', await getWalletBalance(from.publicKey), 'SOL');
    console.log('to Wallet balance:', await getWalletBalance(to.publicKey), 'SOL');
}

transferSol();