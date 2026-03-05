import { getFullnodeUrl, IotaClient } from '@iota/iota-sdk/client';
import { requestIotaFromFaucetV1 } from '@iota/iota-sdk/faucet';
import { Ed25519Keypair } from '@iota/iota-sdk/keypairs/ed25519';

const client = new IotaClient({
  url: getFullnodeUrl('devnet'),  // devnet-এর জন্য
  // testnet চাইলে: getFullnodeUrl('testnet')
});

async function main() {
  try {
    // নতুন র‍্যান্ডম keypair তৈরি করুন
    const keypair = new Ed25519Keypair();

    // hex অ্যাড্রেস পান (0x... ফরম্যাটে)
    const myAddress = keypair.getPublicKey().toIotaAddress();

    console.log('My IOTA Address (hex):', myAddress);

    // পাবলিক কী hex (অপশনাল, ডিবাগের জন্য)
    const pubKeyBytes = keypair.getPublicKey().toRawBytes();
    const pubKeyHex = '0x' + Array.from(pubKeyBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    console.log('Public key (hex):', pubKeyHex);

    // Devnet ফসেট থেকে টোকেন রিকোয়েস্ট (সরাসরি URL দিয়ে)
    console.log('Devnet fucet and token is request...');
    const faucetResponse = await requestIotaFromFaucetV1({
      host: 'https://faucet.devnet.iota.cafe/gas',
      recipient: myAddress
    });
    console.log('Fucet success !', faucetResponse);

    // অপেক্ষা করুন (ফসেট async, টোকেন আসতে ১০-৩০ সেকেন্ড লাগতে পারে)
    console.log('30 seconds for coming tokens.....');
    await new Promise(resolve => setTimeout(resolve, 30000));

    // ব্যালেন্স চেক: getCoins দিয়ে owner হিসেবে অ্যাড্রেস দিন
    console.log('Balance is checking...');
    const coins = await client.getCoins({ owner: myAddress });

    let totalBalance = 0n;
    if (coins && coins.data && coins.data.length > 0) {
      for (const coin of coins.data) {
        totalBalance += BigInt(coin.balance);
      }
    }

    const balanceInIOTA = Number(totalBalance) / 1_000_000_000;
    console.log('My total Balance:', balanceInIOTA.toFixed(6), 'IOTA');
    console.log('Getting total coins', coins?.data?.length || 0);

    // যদি ০ দেখায়, explorer-এ চেক করুন
    if (balanceInIOTA === 0) {
      console.log('Balance is zero, please check in explorer:');
      console.log('https://explorer.rebased.iota.org/?network=devnet');
      console.log('Please address paste', myAddress);
    }

  } catch (error) {
    console.error('Error :', error.message || error);
    console.log('if you are using devnet, please check the faucet and explorer:');
  }
}

main();




// ব্লকচেইন / Web3 / Cryptocurrency-এ "Hello World" এর মানে কী?
// আপনার ক্ষেত্রে (IOTA Devnet-এ যা করেছেন), "Hello World" একটু অ্যাডভান্সড ভার্সন:

// সাধারণ প্রোগ্রামিং-এ → শুধু "Hello World" প্রিন্ট করা
// ব্লকচেইন-এ → নেটওয়ার্কের সাথে সফলভাবে ইন্টারঅ্যাক্ট করা দেখানো
// Wallet/address তৈরি করা
// Testnet/Devnet-এ faucet থেকে টেস্ট টোকেন নেওয়া
// ব্যালেন্স চেক করা (যেটা আপনি করেছেন: 10 IOTA পেয়েছেন)


// আপনার কোডটা যা করেছে:

// একটা নতুন IOTA অ্যাড্রেস (public key থেকে) জেনারেট করা
// Devnet faucet-এ রিকোয়েস্ট পাঠানো → টোকেন পাওয়া
// ব্যালেন্স কোয়েরি করে দেখা যে টোকেন এসেছে (10 IOTA)


                                          // ৪. আপনার কোডের সাথে এর সম্পর্ক
                                          // আপনি যখন আপনার index.js ফাইলে requestIotaFromFaucetV1 কল করেন:
                                          // ১. আপনার লেনদেনটি Tangle-এ একটি নতুন বিন্দু হিসেবে যুক্ত হওয়ার চেষ্টা করে।
                                          // ২. এটি নেটওয়ার্কের অন্য দুটি লেনদেনকে বেছে নেয় ভেরিফাই করার জন্য।
                                          // ৩. নেটওয়ার্কের অন্য কেউ আবার আপনার লেনদেনটিকে ভেরিফাই করে।
                                          // ৪. আপনার কোডে যে ৩০ সেকেন্ডের বিরতি আছে, সেটি মূলত এই ভেরিফিকেশন প্রসেসটি সম্পন্ন হওয়ার জন্য দেওয়া হয়েছে।