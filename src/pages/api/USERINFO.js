import { ethers } from 'ethers';

export default async function handler(req, res) {
  try {
    if (!req.body.signature || !req.body.content) {
      res.status(400).json({ success: false, error: 'Invalid request. Signature and content are required.' });
      return;
    }

    // Use the appropriate Ethereum provider, for example, Infura
    const provider = new ethers.providers.JsonRpcProvider('https://scroll-sepolia.blockpi.network/v1/rpc/public');

    // Use a signer provider
    const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PUB_KEY, provider);

    const signature = req.body.signature;
    const content = req.body.content;

    // Verify the signature against the content
    const messageHash = ethers.utils.hashMessage(ethers.utils.toUtf8Bytes(content));
    const recoveredAddress = ethers.utils.verifyMessage(messageHash, signature);

    // Use the recovered address as the sender's address
    const senderAddress = recoveredAddress;
	if (!content || typeof content !== 'object') {
		res.status(400).json({ success: false, error: 'Invalid content format.' });
		return;
	  }

    // Replace this with your logic to check if senderAddress is authorized

    const contractAddress = process.env.NEXT_PUBLIC_C1_KEY;
    const contractABI = [
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "_name",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_email",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_location",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_description",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_pcd",
					"type": "string"
				}
			],
			"name": "registerUser",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "userAddress",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "name",
					"type": "string"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "email",
					"type": "string"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "location",
					"type": "string"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "description",
					"type": "string"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "pcd",
					"type": "string"
				}
			],
			"name": "UserRegistered",
			"type": "event"
		},
		{
			"inputs": [],
			"name": "getUserInfo",
			"outputs": [
				{
					"internalType": "string",
					"name": "name",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "email",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "location",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "description",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "pcd",
					"type": "string"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "users",
			"outputs": [
				{
					"internalType": "string",
					"name": "name",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "email",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "location",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "description",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "pcd",
					"type": "string"
				}
			],
			"stateMutability": "view",
			"type": "function"
		}
	]

    // Use the signer to send transactions
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
	const tx = await contract.registerUser(
		content.name,        // Pass the name from content
		content.email,       // Pass the email from content
		content.location,    // Pass the location from content
		content.description,  // Pass the description from content
		content.pcd
	  );

    // Wait for the transaction to be mined
    await tx.wait();

    res.status(200).json({ success: true, message: 'Data added successfully!' });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}
