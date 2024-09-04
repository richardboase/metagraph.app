// build/app/helloworld.js
import Head from 'next/head'
import { useState } from 'react'
import TopButtons from '../components/TopButtons'
import CreatorForm from '../components/CreatorForm'
import TokenForm from '../components/TokenForm'
import MusicForm from '../components/MusicForm'
import PictureForm from '../components/PictureForm'
import GamingCardForm from '../components/GamingCardForm'

export default function HelloWorld() {
  const [tokenType, setTokenType] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log('Form submitted')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>BSVMint - Create Your Token</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">BSVMint - Create Your Token</h1>
        
        <TopButtons />

        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-2xl font-semibold mb-6">Mint Your Own Token on BitcoinSV</h2>
          <p className="mb-6">
            Use the form below to create your custom token on the BitcoinSV blockchain. This powerful feature allows you to tokenize assets, create utility tokens, or even launch your own cryptocurrency. Fill in the details about your token, including its name, supply, and other key information. Once you've entered all the required data, click the "MINT" button to create your token on the blockchain.
          </p>

          <form onSubmit={handleSubmit}>
            <CreatorForm />
            <TokenForm setTokenType={setTokenType} />
            {tokenType === 'Music Track' && <MusicForm />}
            {tokenType === 'Picture' && <PictureForm />}
            {tokenType === 'Gaming Card' && <GamingCardForm />}

            <div className="mt-6">
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
                onClick={() => console.log('Generate Random Seed')}
              >
                Generate Random Seed
              </button>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                MINT
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="text-center py-4">
        <p>© 2024 b0ase1. All rights reserved.</p>
      </footer>
    </div>
  )
}