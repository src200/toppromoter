import { getUser } from '@/utils/supabase-admin';
import { billingUsageDetails } from '@/utils/useDatabase';
import { withSentry } from '@sentry/nextjs';

const teamUsage = async (req, res) => {
  if (req.method === 'POST') {
    const token = req.headers.token;
    const { teamId } = req.body;
    
    try {
      const user = await getUser(token, teamId);

      if(user){
        const data = await billingUsageDetails(teamId);

        console.log(data)

        if(data !== "error"){
          return res.status(200).json({ response: data });
        }
      }

      return res.status(500).json({ response: 'error' });
      
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default process.env.SENTRY_AUTH_TOKEN ? withSentry(teamUsage) : teamUsage;