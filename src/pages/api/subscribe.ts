import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";
import { stripe } from "../../services/stripe";

type User = {
  ref: {
    id: string
  }
  data: {
    stripe_customer_id: string
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST'){
    //cadastrando o clinte no stripe
    const session = await getSession({ req })

    // buscando os dados do usuario
    const user = await fauna.query<User>(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          q.Casefold(session.user.email)
        )
      )
    )

    let customerId = user.data.stripe_customer_id

    if(!customerId){
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
      })

      // atualizando o usuario
      await fauna.query(
        q.Update(
          q.Ref(q.Collection('users'), user.ref.id),
          {
            data: {
              stripe_customer_id: stripeCustomer.id,
            }
          }
        )
      )
      customerId = stripeCustomer.id

    }
    
    // redireciona o usuario para o checkout
    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
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