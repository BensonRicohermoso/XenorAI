import type { NextApiRequest, NextApiResponse } from 'next';

type HealthResponse = {
  status: string;
  gemini_configured: boolean;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthResponse>
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'GET') {
    res.status(405).end();
    return;
  }

  res.status(200).json({
    status: 'healthy',
    gemini_configured: !!process.env.GEMINI_API_KEY,
  });
}
