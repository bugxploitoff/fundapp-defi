import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import getWeb3 from '../../utils/getWeb3';

const Ind = () => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState("");
  const [APP, setAPP] = useState("");
  const [area, setArea] = useState("");
  const [web3, setWeb3] = useState(null);
  const queryString = window.location.search;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/USERDATA${queryString}`);
        if (response.ok) {
          const data = await response.json();
          setName(data.data[0]);
          setDesc(data.data[4]);
          setType(data.data[1]);
          setArea(data.data[2]);
          setAPP(data.data[5]);
        } else {
          window.location.href = "/";
        }
      } catch (error) {
        window.location.href = "/";
      }
    };

    fetchData();
  }, [queryString]);

  const enableMetaMask = async () => {
    try {
      await window.ethereum.enable();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const userAddress = await signer.getAddress();
      console.log('User Address:', userAddress);

      const timestamp = Date.now();
      const message = `Sign in request for user ${name} at ${timestamp}`;

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

  const handlePayment = async () => {
    try {
      if (!web3) {
        console.error('Web3 not initialized. Please connect to MetaMask.');
        return;
      }

      const dataForSubmission = {
        token: 10,
      };

      const content = JSON.stringify(dataForSubmission);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const signature = await signer.signMessage(ethers.utils.toUtf8Bytes(content));

      console.log(dataForSubmission);
      const response = await fetch('/api/DEWALLET', {
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
        alert("TOKEN TRANSFERRED");
      } else {
        console.error(responseData.error);
      }
    } catch (error) {
      console.error('Error submitting data:', error.message);
    }
  };

  return (
    <section className="pb-12 bg-gradient-to-b from-[#E8E3F5] via-[#EDEAFB] to-[#F7FAFC]">
      <div className="items-center pt-12 px-8 mx-auto max-w-7xl lg:px-16 md:px-12">
        <div className="justify-center w-full text-center lg:p-10 max-auto">
          <div className="justify-center w-full mx-auto">
            <div className="flex flex-col items-center justify-center max-w-xl gap-3 mx-auto lg:flex-row">
              <img
                className='w-32 h-32 rounded-full border border-[#E8E3F4]'
                src='https://img.freepik.com/premium-vector/charity-logo-with-love-design-community-love-care_526811-310.jpg'
              />
            </div>

            <p className="mt-4 sm:px-32 text-[#10172A] sm:text-xl text-sm font-semibold tracking-tighter">
              by @{name} 🏝️
            </p>

            <p className="sm:mt-8 mt-3 sm:px-44 text-[#10172A] text-4xl sm:text-6xl font-semibold tracking-tighter">
              <span className="underline leading-8 underline-offset-8	decoration-8 decoration-[#8B5CF6]">FUND-DAPP</span> by {APP} .
            </p>

            <p className="sm:mt-8 mt-2.5 text-[#10172A] sm:px-72  sm:leading-loose text-lg font-normal tracking-tighter">
              {desc} | <br /> AREA: {area}
            </p>
          </div>
        </div>
      </div>

      <div className="text-center space-x-4 mt-6">
        <button onClick={handlePayment} className="bg-[#8B5CF6] translate-y-1 text-[#fff] sm:text-lg text-xs font-bold py-2.5 px-6  rounded-full inline-flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clip-rule="evenodd" />
          </svg>

          &nbsp; &nbsp;<span> DONATE 10 TOKENS </span>
        </button>
      </div>
    </section>
  );
};

export default Ind;
