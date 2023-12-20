import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import getWeb3 from '../../utils/getWeb3';
import { AnonAadhaarPCD } from "anon-aadhaar-pcd";
import { FunctionComponent } from "react";

const truncate = (str: string, max: number) => {
  return str.length > max ? str.substring(0, max) + "..." : str;
};

type RatingProps = {
  pcd: AnonAadhaarPCD;
};



const CEvents: FunctionComponent<RatingProps> = ({ pcd })=> {
  const [web3, setWeb3] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    token: '',
  });

  

  const enableMetaMask = async () => {
    try {
      await window.ethereum.enable();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
  
      // Get the user's address
      const userAddress = await signer.getAddress();
      console.log('User Address:', userAddress);
  
      // Prepare the message data (include a timestamp or unique identifier)
      const timestamp = Date.now();
      const message = `Sign in request for user ${formData.name} at ${timestamp}`;
  
      // Use the signer to sign the message
      const signature = await signer.signMessage(ethers.utils.toUtf8Bytes(message));
      console.log('Signature:', signature);
    } catch (error) {
      console.error('Error enabling MetaMask:', error.message);
    }
  };
  

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const web3Instance = await getWeb3();
        enableMetaMask();
        setWeb3(web3Instance);
      } catch (error) {
        console.error('Error initializing web3:', error.message);
      }
    };

    initWeb3();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      if (!web3) {
        console.error('Web3 not initialized. Please connect to MetaMask.');
        return;
      }
  
      // Prepare the data for submission
      const dataForSubmission = {
        name: formData.name,
        token: formData.token,
      };
  
      // Convert the data to a JSON string
      const content = JSON.stringify(dataForSubmission);
  
      // Sign the content with MetaMask signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const signature = await signer.signMessage(ethers.utils.toUtf8Bytes(content));
  
      console.log(dataForSubmission)
      const response = await fetch('/api/WALLET', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: dataForSubmission,
          signature,
        }),
      });
  
      const responseData = await response.json();
  
      if (responseData.success) {
        console.log(responseData.message);
        alert("TOKEN TRANSFERED");
        // Optionally, you can perform additional actions after a successful submission
      } else {
        console.error(responseData.error);
      }
    } catch (error) {
      console.error('Error submitting data:', error.message);
    }
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <div className="flex justify-center mb-6">
          <span className="inline-block bg-gray-200 rounded-full p-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4" />
            </svg>
          </span>
        </div>
        <h2 className="text-2xl font-semibold text-center mb-4">NUMBER TO TOKEN YOU WANT</h2>
        <p className="text-gray-600 text-center mb-6">NOT MORE THAN 100</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Full Name</label>
            <input
              type="text"
              id="name"
              className="form-input w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500"
              required
              placeholder="Sumon Nath"
              onChange={handleChange}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Amount</label>
            <input
              type="number"
              id="token"
              className="form-input w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500"
              required
              placeholder="100"
              onChange={handleChange}
            />
            <p className="text-gray-600 text-xs mt-1">100 COINS</p>
          </div>
          {web3 ? (
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              WITHDRAW
            </button>
          ) : (
            <button
              className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              disabled
            >
              CONNECT TO META MASK
            </button>
          )}

          <p className="text-gray-600 text-xs text-center mt-4">
            By clicking Register, you agree to accept the
            <a href="#" className="text-blue-500 hover:underline">
              Terms and Conditions
            </a>
            .
          </p>
        </form>
      </div>
    </div>
  );
};

export default CEvents;
