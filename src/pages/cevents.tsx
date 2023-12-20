import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import getWeb3 from '../../utils/getWeb3';
import { AnonAadhaarPCD } from 'anon-aadhaar-pcd';
import { FunctionComponent } from 'react';

// Extend the Window interface
interface WindowWithEthereum extends Window {
  ethereum?: any; // Adjust the type accordingly based on your requirements
}

const CEvents: FunctionComponent<RatingProps> = ({ pcd }) => {
  const [web3, setWeb3] = useState<any>(null); // Adjust the type accordingly based on your requirements
  const [formData, setFormData] = useState({
    name: '',
    supportType: '',
    location: '',
    description: '',
  });

  const enableMetaMask = async () => {
    try {
      const windowWithEthereum = window as WindowWithEthereum;

      if (windowWithEthereum.ethereum) {
        await windowWithEthereum.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(windowWithEthereum.ethereum);
        const signer = provider.getSigner();

        // Rest of your code
      } else {
        console.error('MetaMask not found on window.ethereum');
      }
    } catch (error) {
      console.error('Error enabling MetaMask:');
    }
  };

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const web3Instance = await getWeb3();
        enableMetaMask();
        setWeb3(web3Instance);
      } catch (error) {
        console.error('Error initializing web3:');
      }
    };

    initWeb3();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (!web3) {
        console.error('Web3 not initialized. Please connect to MetaMask.');
        return;
      }

      // Prepare the data for submission
      const dataForSubmission = {
        name: formData.name,
        email: formData.supportType,
        location: formData.location,
        description: formData.description,
        pcd: 'FUNDDAPP',
      };

      // Convert the data to a JSON string
      const content = JSON.stringify(dataForSubmission);

      // Sign the content with MetaMask signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const signature = await signer.signMessage(ethers.utils.toUtf8Bytes(content));

      console.log(dataForSubmission);
      const response = await fetch('/api/USERINFO', {
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
        alert('DATA CREATED');
        // Optionally, you can perform additional actions after a successful submission
      } else {
        console.error(responseData.error);
      }
    } catch (error) {
      console.error('Error submitting data:', error.message);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        <h2 className="text-2xl font-semibold text-center mb-4">Register For Support</h2>
        <p className="text-gray-600 text-center mb-6">Enter your Support Type</p>
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
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Support Type</label>
            <input
              type="text"
              id="supportType"
              className="form-input w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500"
              required
              placeholder="Fund IT"
              onChange={handleChange}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Location</label>
            <input
              type="text"
              id="location"
              className="form-input w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500"
              required
              placeholder="743144"
              onChange={handleChange}
            />
            <p className="text-gray-600 text-xs mt-1">Must Be proper pin code</p>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Description</label>
            <input
              type="text"
              id="description"
              className="form-input w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500"
              required
              placeholder="Description"
              onChange={handleChange}
            />
            <p className="text-gray-600 text-xs mt-1">Description About the support</p>
          </div>
          {web3 ? (
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Register
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

// Adjust the type of web3 state and other types accordingly based on your requirements
type RatingProps = {
  pcd: AnonAadhaarPCD;
};

