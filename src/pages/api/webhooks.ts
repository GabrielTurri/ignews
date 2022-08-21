import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from 'stream'
import Stripe from "stripe";
import { stripe } from "../../services/stripe";

// converte a readable string num objeto
async function buffer(readable: Readable){
  // pedaços da string
  const chunks = [];

  // pra cada valor recebido, armazenado em forma de chunk
  for await (const chunk of readable){
    chunks.push(
      typeof chunk === "string" ? Buffer.from(chunk) : chunk
    );
  }
  // concatena todos os chunks e converte num buffer
  return Buffer.concat(chunks)  
}
// desabilitando o entendimento padrão sobre o que vem da requisição
export const config ={
  api: {
    bodyParser: false
  }
}

const relevantEvents = new Set([
  'checkout.session.completed'
])

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
  const buf = await buffer(req)
  const secret = req.headers['stripe-signature']

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET);
  } catch(err){
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  const { type } = event
  
  if (!relevantEvents.has(type)){
    console.log('Evento recebido', event)
  }

  res.json({ received: true})
} else {//passando para o frontend que o metodo que essa rota aceita é post
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }
}