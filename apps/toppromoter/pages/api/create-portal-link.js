import { stripe } from '@/utils/stripe';
import { getUser } from '@/utils/supabase-admin';
import { createOrRetrieveCustomer } from '@/utils/useDatabase';
import { getURL } from '@/utils/helpers';
import { withSentry } from '@sentry/nextjs';

const createPortalLink = async (req, res) => {
  if (req.method === 'POST') {
    const token = req.headers.token;
    const { teamId } = req.body;

    try {
      const user = await getUser(token, teamId);
      const customer = await createOrRetrieveCustomer({
        teamId: user.team_id,
        email: user.email
      });

      const { url } = await stripe.billingPortal.sessions.create({
        customer,
        return_url: `${getURL()}/dashboard`
      });

      return res.status(200).json({ url });
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

export default process.env.SENTRY_AUTH_TOKEN ? withSentry(createPortalLink) : createPortalLink;