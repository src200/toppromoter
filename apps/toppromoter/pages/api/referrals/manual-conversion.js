import { getUser } from '@/utils/supabase-admin';
import { referralCreate } from '@/utils/useDatabase';
import { withSentry } from '@sentry/nextjs';
import { supabaseAdmin } from '@/utils/supabase-admin';
import { stripe } from '@/utils/stripe';
import { LogSnagPost } from '@/utils/helpers';
import { sendEmail } from '@/utils/sendEmail';

const manualConversion = async (req, res) => {
  if (req.method === 'POST') {
    const token = req.headers.token;
    const { companyId, teamId, campaignId, affiliateId, emailAddress, orderId } = req.body;
    
    try {
      const user = await getUser(token, teamId);

      if(user){
        const create = await referralCreate(user, companyId, campaignId, affiliateId, emailAddress, orderId);

        if(create !== "error"){
          return res.status(200).json({ response: create });
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

export default process.env.SENTRY_AUTH_TOKEN ? withSentry(createReferral) : createReferral;