import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Add welcome message when component mounts
    const welcomePrompt = require('../agent/prompts/conversation_flows.json').welcome;
    setMessages([{ role: 'assistant', content: welcomePrompt.replace('[city]', 'your target city') }]);
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      let response;
      
      if (input.toLowerCase().includes('budget') || input.match(/\$\d+/)) {
        response = require('../agent/prompts/conversation_flows.json').budget_optimization
          .replace('[X]', '$2,000')
          .replace('[city]', 'New York')
          .replace('[Neighborhood A]', 'Downtown')
          .replace('[price]', '$2,100')
          .replace('[features]', 'updated appliances, good location')
          .replace('[Neighborhood B]', 'Midtown')
          .replace('[price]', '$1,850')
          .replace('[features]', 'more space, older building')
          .replace('[Neighborhood C]', 'Uptown')
          .replace('[price]', '$1,650')
          .replace('[features]', 'longer commute, quieter area');
      } 
      else if (input.toLowerCase().includes('property') || input.toLowerCase().includes('apartment')) {
        response = require('../agent/prompts/conversation_flows.json').property_suggestion
          .replace('[Address]', '123 Main Street, Downtown, New York')
          .replace('[Price]', '$2,100')
          .replace('[Bedrooms]', '1')
          .replace('[Bathrooms]', '1')
          .replace('[Feature 1]', 'In-unit laundry')
          .replace('[Feature 2]', 'Hardwood floors')
          .replace('[Feature 3]', 'Stainless steel appliances')
          .replace('[X]', '15')
          .replace('[Score]', '85')
          .replace('[Date]', 'June 15th');
      }
      else if (input.toLowerCase().includes('neighborhood') || input.toLowerCase().includes('area')) {
        response = require('../agent/prompts/conversation_flows.json').neighborhood_insight
          .replace('[Neighborhood]', 'Downtown')
          .replace('[Score]', '82')
          .replace('[demographic information]', 'Young professionals (25-40)')
          .replace('[Rating]', 'Moderate')
          .replace('[time]', '10PM')
          .replace('[time]', '2AM')
          .replace('[X]', '15')
          .replace('[Store names]', 'Metro Market, Urban Foods')
          .replace('[distance]', '0.2-0.5mi')
          .replace('[X]', '32')
          .replace('[Score]', '76')
          .replace('[Score]', '72');
      }
      else if (input.toLowerCase().includes('negotiate') || input.toLowerCase().includes('price')) {
        response = require('../agent/prompts/conversation_flows.json').negotiation_strategy
          .replace('[Address]', '123 Main Street, Downtown, New York')
          .replace('[Price]', '$2,100')
          .replace('[X]', '28')
          .replace('[Y]', '14')
          .replace('[X]', '5')
          .replace('[specific amount]', '$100')
          .replace('[X]', '5')
          .replace('[specific reasons]', 'longer than average listing time and comparable units in the building');
      }
      else if (input.toLowerCase().includes('contract') || input.toLowerCase().includes('lease')) {
        response = require('../agent/prompts/conversation_flows.json').contract_review
          .replace('[Address]', '123 Main Street, Downtown, New York')
          .replace('[Duration]', '12 months')
          .replace('[Amount]', 'One month's rent ($2,100)')
          .replace('[Terms]', 'Maximum 3% annual increase')
          .replace('[specific items]', 'appliance repairs and HVAC maintenance');
      }
      else {
        response = require('../agent/prompts/conversation_flows.json').lifestyle_analysis;
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Virtuals AI Agent</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Virtuals AI Agent</h1>
          <div className="flex items-center">
            <span className="bg-green-500 px-2 py-1 rounded text-xs font-medium">BLOCKCHAIN POWERED</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto flex flex-col md:flex-row p-4 gap-4">
        {/* Conversation Panel */}
        <div className="flex-1 border rounded-lg shadow-lg flex flex-col h-[600px] bg-gray-50">
          <div className="bg-blue-600 text-white p-3 rounded-t-lg">
            <h2 className="font-medium">Rental Assistant</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${message.role === 'user' ? 
                  'bg-blue-600 text-white rounded-br-none' : 
                  'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                  <p className="whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-lg bg-gray-200 text-gray-800 rounded-bl-none">
                  <p>Thinking...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSubmit} className="p-3 border-t">
            <div className="flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ask about rental properties..."
              />
              <button 
                type="submit" 
                className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700 transition"
              >
                Send
              </button>
            </div>
          </form>
        </div>
        
        {/* Property Preview Panel */}
        <div className="md:w-1/3 border rounded-lg shadow-lg flex flex-col h-[600px] bg-white">
          <div className="bg-blue-600 text-white p-3 rounded-t-lg">
            <h2 className="font-medium">Featured Property</h2>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto">
            <div className="relative w-full h-48 bg-gray-300 rounded-lg mb-4">
              <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-2 py-1 m-2 rounded">
                ✓ VERIFIED
              </div>
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                Property Image
              </div>
            </div>
            
            <h3 className="font-bold text-lg">123 Main Street</h3>
            <p className="text-gray-500 mb-2">Downtown, New York</p>
            
            <div className="text-xl font-bold text-blue-600 mb-3">$2,100/month</div>
            
            <div className="flex gap-2 mb-3">
              <span className="bg-gray-200 px-2 py-1 rounded text-sm">1 Bed</span>
              <span className="bg-gray-200 px-2 py-1 rounded text-sm">1 Bath</span>
              <span className="bg-gray-200 px-2 py-1 rounded text-sm">Available June 15</span>
            </div>
            
            <h4 className="font-medium mb-2">Features</h4>
            <ul className="list-disc list-inside mb-4 text-gray-700">
              <li>In-unit laundry</li>
              <li>Hardwood floors</li>
              <li>Stainless steel appliances</li>
              <li>15 minute commute to business district</li>
            </ul>
            
            <h4 className="font-medium mb-2">Verification</h4>
            <div className="flex items-center gap-1 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm">Blockchain Verified</span>
            </div>
            <div className="flex items-center gap-1 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm">Owner Confirmed</span>
            </div>
            <div className="flex items-center gap-1 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm">No Scam Indicators</span>
            </div>
            
            <button className="w-full bg-blue-600 text-white py-2 rounded mt-4 hover:bg-blue-700 transition">
              Request Viewing
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t p-4">
        <div className="container mx-auto text-center text-gray-600">
          <p>© 2023 Virtuals Protocol - Blockchain-Powered Rental Platform</p>
        </div>
      </footer>
    </div>
  );
}
