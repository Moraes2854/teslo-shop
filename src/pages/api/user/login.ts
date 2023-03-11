import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs';

import { db } from '../../../database';
import { AuthResponse } from '../../../interfaces';
import { User } from '../../../models';
import { signToken } from '../../../utils';

type Data = 
    | { message: string; }
    | AuthResponse;

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {

    switch( req.method ){
        case 'POST':
            return loginUser( req, res )
        default:
            res.status(400).json({
                message: 'Bad Request'
            })
    }

}

const loginUser = async( req: NextApiRequest, res: NextApiResponse<Data> )  => {

    const { email = '', password = '' } = req.body;

    await db.connect();

    const user = await User.findOne({ email });

    if ( !user ) return res.status(400).json({ message: 'Correo o contraseña no válidos' });

    if ( !bcrypt.compareSync( password, user.password! ) ) return res.status(400).json({ message: 'Correo o contraseña no válidos' });

    await db.disconnect();

    const { name, role } = user;

    const token = signToken( user._id, email );

    return res.status(200).json({
        token,
        user: {
            name,
            email,
            role,
        }
    })

}
