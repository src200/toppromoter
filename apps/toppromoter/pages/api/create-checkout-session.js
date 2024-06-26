import { stripe } from '@/utils/stripe';
import { getUser } from '@/utils/supabase-admin';
import { createOrRetrieveCustomer } from '@/utils/useDatabase';
import { getURL } from '@/utils/helpers';
import { withSentry } from '@sentry/nextjs';

const createCheckoutSession = async (req, res) => {
  if (req.method === 'POST') {
    const token = req.headers.token;
    const { price, teamId, quantity = 1, metadata = {} } = req.body;

    try {
      const user = await getUser(token, teamId);
      const customer = await createOrRetrieveCustomer({
        id: user.id,
        teamId: user.team_id,
        email: user.email
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        billing_address_collection: 'required',
        customer,
        line_items: [
          {
            price,
            quantity
          }
        ],
        mode: 'subscription',
        allow_promotion_codes: true,
        subscription_data: {
          trial_from_plan: true,
          metadata
        },
        success_url: `${getURL()}/dashboard`,
        cancel_url: `${getURL()}/`
      });

      return res.status(200).json({ sessionId: session.id });
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

export default process.env.SENTRY_AUTH_TOKEN ? withSentry(createCheckoutSession) : createCheckoutSession;