import type { NextApiRequest, NextApiResponse } from 'next'

import { isValidToken, signToken } from '../../../utils/jwt';
import { db } from '../../../database';
import User from '../../../models/User';
import { AuthResponse } from '../../../interfaces';

type Data = 
    | { message: string; }
    | AuthResponse;
    
export default function (req: NextApiRequest, res: NextApiResponse<Data>) {

    switch( req.method ){
        case 'GET':
            return validateToken( req, res)
        default:
            res.status(400).json({
                message: 'Bad Request'
            })
    }

}

const validateToken = async( req: NextApiRequest, res: NextApiResponse<Data> )  => {

    const { token = '' } = req.cookies;
    
    let userId = '';

    try {
        userId = await isValidToken( token.toString() );
    } catch (error) {
        return res.status(400).json({ message: 'El token de autorización no es válido' });
    }

    await db.connect();

    const user = await User.findById( userId );

    if ( !user ) return res.status(400).json({ message: 'No existe un usuario con el ID solicitado' });

    await db.disconnect();
    
    const { name, email, role }  = user;

    const newToken = signToken( user._id, email );

    return res.status(200).json({
        token: newToken,
        user: {
            name,
            email,
            role,
        }
    })

}
