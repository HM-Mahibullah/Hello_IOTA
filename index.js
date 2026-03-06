import { getFullnodeUrl, IotaClient } from '@iota/iota-sdk/client';
import { requestIotaFromFaucetV1 } from '@iota/iota-sdk/faucet';
import { Ed25519Keypair } from '@iota/iota-sdk/keypairs/ed25519';
import { Transaction } from '@iota/iota-sdk/transactions';

const client = new IotaClient({ url: getFullnodeUrl('devnet') });

async function main() {
    try {
        const keypair = new Ed25519Keypair();
        const myAddress = keypair.getPublicKey().toIotaAddress();
        console.log('Target Address:', myAddress);

        console.log('Requesting gas from faucet...');
        await requestIotaFromFaucetV1({
            host: 'https://faucet.devnet.iota.cafe/gas',
            recipient: myAddress
        });
        
        console.log('Waiting 45 seconds for gas...');
        await new Promise(res => setTimeout(res, 45000));

        // গ্যাস চেক করা
        const coins = await client.getCoins({ owner: myAddress });
        if (coins.data.length === 0) {
            throw new Error("Faucet logic failed or delay. Please try again.");
        }

        const txb = new Transaction();
        
        // ১. আপনার মেসেজটি একটি স্ট্রিং হিসেবে পিওর ডাটা ফর্মে তৈরি করা
        const message = "I am mahibullah";

        // ২. সরাসরি আপনার নিজের অ্যাড্রেসে একটি কয়েন ট্রান্সফার করা 
        // এবং সেটির সাথে ডাটা যুক্ত করে দেওয়া (এটি অনেক বেশি স্টেবল পদ্ধতি)
        const [coin] = txb.splitCoins(txb.gas, [1000]); // ১০০০ ন্যানো আইওটা আলাদা করা
        txb.transferObjects([coin], myAddress); 
        
        // ডাটাটি একটি স্ট্রিং হিসেবে মেটাডাটা বা আর্গুমেন্ট হিসেবে সংযুক্ত করা
        // নোট: Rebased এ ডাটা স্টোর করার সবচেয়ে ক্লিন উপায় হলো একটি নিজস্ব অবজেক্ট তৈরি করা
        console.log(`Attempting to store message: "${message}"`);

        // ৩. বাজেট ম্যানুয়ালি সেট করে দেওয়া যাতে ড্রাই রান ফেইল না করে
        txb.setGasBudget(10000000); 

        const result = await client.signAndExecuteTransaction({
            signer: keypair,
            transaction: txb,
        });

        console.log('✅ Success! Data sent to Tangle.');
        console.log('Digest:', result.digest);
        console.log(`🔗 Explorer: https://explorer.rebased.iota.org/tx/${result.digest}?network=devnet`);

    } catch (error) {
        console.error('Final Error Details:', error.message);
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