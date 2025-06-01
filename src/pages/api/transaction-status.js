import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Transaction ID is required' });
  }

  const appId = process.env.NEXT_PUBLIC_APP_ID;
  if (!appId) {
    console.error('❌ NEXT_PUBLIC_APP_ID not configured');
    return res.status(500).json({ error: 'World App ID not configured' });
  }

  try {
    console.log('🔍 Checking transaction status for ID:', id);
    console.log('🔧 Using App ID:', appId);

    // Query World App API for transaction status
    const apiUrl = `https://developer.worldcoin.org/api/v2/minikit/transaction/${id}?app_id=${appId}&type=transaction`;
    console.log('🌐 API URL:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response statusText:', response.statusText);

    if (!response.ok) {
      console.error('❌ World App API error:', response.status, response.statusText);
      
      // Get response text to see what the API actually returned
      const errorText = await response.text();
      console.error('❌ Error response body:', errorText);
      
      return res.status(response.status).json({ 
        error: `World App API error: ${response.status} ${response.statusText}`,
        details: errorText
      });
    }

    // Get response text first and log it
    const responseText = await response.text();
    console.log('📄 Raw response text:', responseText);

    // Try to parse JSON
    let transactionData;
    try {
      transactionData = JSON.parse(responseText);
      console.log('📊 Parsed transaction data:', transactionData);
    } catch (jsonError) {
      console.error('❌ JSON parsing error:', jsonError);
      console.error('❌ Response text that failed to parse:', responseText);
      return res.status(500).json({ 
        error: 'Failed to parse World App API response',
        details: jsonError.message,
        rawResponse: responseText
      });
    }

    // Return the transaction data
    res.status(200).json(transactionData);

  } catch (error) {
    console.error('❌ Error checking transaction status:', error);
    res.status(500).json({ 
      error: 'Failed to check transaction status',
      details: error.message 
    });
  }
} 