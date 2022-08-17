import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { stripe } from "../../services/stripe";

export default async (req: NextApiRequest, res: NextApiResponse){
  if (req.method === 'POST'){
    //cadastrando o clinte no stripe
    const session = await getSession({ req })

    const stripeCustomer = await stripe.customers.create({
      email: session.user.email,
      // metadata
    })

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomer.id,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        { price: 'price_1LWLHdErqPTfV9ffXgrretJj', quantity: 1 },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,  
    })

    return res.status(200).json({ sessionId: stripeCheckoutSession.id })
  } else { //passando para o frontend que o metodo que essa rota aceita é post
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }
}