import Head from "next/head";
import {
  AnonAadhaarProof,
  LogInWithAnonAadhaar,
  useAnonAadhaar,
} from "anon-aadhaar-react";
import { useEffect } from "react";
import Link from "next/link";

export default function Home() {
  // Use the Country Identity hook to get the status of the user.
  const [anonAadhaar] = useAnonAadhaar();

  useEffect(() => {
    console.log("Anon Aadhaar: ", anonAadhaar.status);
  }, [anonAadhaar]);

  return (
    <div>
  <section>
    <section className="sticky">

      <div
        className="max-w-lg px-4 sm:pt-24 pt-12 sm:pb-8 mx-auto text-left md:max-w-none md:text-center"
      >
        <div className='text-center py-4 hidden sm:block'>
          <button className="bg-white border border-[#E2E8F0] hover:bg-neutral-200 text-xs font-bold py-2.5 px-4 rounded-full inline-flex items-center">
            &nbsp; &nbsp;<span> FUND DAPP </span>
          </button>
        </div>


        <h1
          className="font-extrabold leading-10 tracking-tight text-left text-[#201515] text-center sm:leading-none text-5xl sm:text-9xl"
        >
          <span className="inline md:block">HELP THE </span>
          <span
            className="relative mt-2 bg-clip-text text-[#201515] md:inline-block"
          >NEEDY.</span>
        </h1>
      </div>


      <div
        className="max-w-lg px-4 pb-24 mx-auto text-left md:max-w-none md:text-center"
      >
        <div className='text-center py-4 space-x-4'>

          <div className="font-semibold py-3 px-6 rounded-3xl inline-flex items-center pb-3">
          <LogInWithAnonAadhaar />
          </div>
          {anonAadhaar?.status === "logged-in" && (
          <>
          <div>
            <p>✅ Proof is valid</p>
            <p>Got your Aadhaar Identity Proof</p>
                    <a className="inline-flex items-center justify-center text-sm font-semibold text-black duration-200 hover:text-blue-500 focus:outline-none focus-visible:outline-gray-600" href="/cevents">
                      <span> CONTINUE &nbsp; → </span>
                    </a>
            </div>
          </>
        )}
          
        </div>
      </div>

    </section>
  </section>


  <div className="text-left">

    <div className='sm:px-28'>
      <section className="relative flex items-center w-full">
        <div className="relative items-center w-full px-5 mx-auto md:px-12 lg:px-16 max-w-7xl">
          <div className="relative flex-col items-start m-auto align-middle">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-24">
              <div className="relative items-center gap-12 m-auto lg:inline-flex md:order-first">
                <div className="max-w-xl text-center lg:text-left">
                  <div>

                    <p className="text-3xl font-semibold tracking-tight text-[#201515] sm:text-5xl">
                      FUND DAPP
                    </p>
                    <p className="max-w-xl mt-4 text-base tracking-tight text-gray-600">
                      Its is basically a platform where people can help, collect funds, and get the help of other so that the proof of transfer from valid user can be maintain on chain
                    </p>
                  </div>
                  <div className="flex justify-center gap-3 mt-10 lg:justify-start">
                    <Link className="inline-flex items-center justify-center text-sm font-semibold text-black duration-200 hover:text-blue-500 focus:outline-none focus-visible:outline-gray-600" href="/withdraw">
                      <span> NEED FUNDS &nbsp; → </span>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="order-first block w-full mt-12 aspect-square lg:mt-0">
                <img className="object-cover rounded-3xl object-center w-full mx-auto bg-gray-300 lg:ml-auto " alt="hero" src="https://miro.medium.com/v2/resize:fit:1400/1*FX6sFLlf5NfUfRoalrfupg.gif" />
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>

    <div className="mt-32" />

    <section>

    </section>

  </div>
</div>
  );
}
