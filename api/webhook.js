export default async function handler(req, res) {
  // Log request để debug
  console.log('📨 Webhook received:', {
    method: req.method,
    headers: req.headers,
    body: req.body,
    timestamp: new Date().toISOString()
  });

  try {
    // URL Google Apps Script của bạn
    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxNV3x4sXlMfoMIAV8LqqSAQltMBz6pouEI-48YhiJXnwFKuIKE7YCIxIn2OgLlFp0/exec';
    
    // Chỉ xử lý POST requests từ Zalo
    if (req.method !== 'POST') {
      return res.status(405).json({ 
        error: 'Method not allowed',
        message: 'Only POST requests are accepted' 
      });
    }

    // Kiểm tra có data không
    if (!req.body) {
      return res.status(400).json({ 
        error: 'Bad request',
        message: 'Request body is required' 
      });
    }

    // Forward request đến Google Apps Script
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Zalo-Webhook-Proxy/1.0'
      },
      body: JSON.stringify(req.body)
    });

    const result = await response.text();
    
    console.log('✅ Apps Script response:', {
      status: response.status,
      result: result,
      timestamp: new Date().toISOString()
    });

    // Trả về response cho Zalo
    res.status(response.status).send(result);

  } catch (error) {
    console.error('❌ Webhook proxy error:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    res.status(500).json({
      error: 'Internal server error',
      message: 'Webhook proxy failed'
    });
  }
}
