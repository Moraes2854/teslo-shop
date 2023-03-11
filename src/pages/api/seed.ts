import type { NextApiRequest, NextApiResponse } from 'next';

import { Product } from '../../models';
import { db, seedDatabase } from '../../database';
import User from '../../models/User';

type Data = {
  message: string
}

export default async function handler( req: NextApiRequest, res: NextApiResponse<Data> ) {

  if (process.env.NODE_ENV === 'production') return res.status(401).json({ message: 'No tiene acceso a este servicio' });

  await db.connect();

  await Product.deleteMany();
  await Product.insertMany( seedDatabase.initialData.products );

  await User.deleteMany();
  await User.insertMany( seedDatabase.initialData.users );

  await db.disconnect();

  res.status(200).json({ message: 'Proceso ejecutado exitosamente' });
}
