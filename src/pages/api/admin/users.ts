import type { NextApiRequest, NextApiResponse } from 'next';

import { db } from '../../../database';
import { User } from '../../../models';
import { IUser } from '../../../interfaces';
import { isValidObjectId } from 'mongoose';

type Data = 
    | { message: string }
    | IUser[]

export default function ( req: NextApiRequest, res: NextApiResponse<Data> ) {
    switch ( req.method ) {
        case 'GET':
            return getUsers( req, res );
            
        case 'PUT':
            return updateUser( req, res )
        
    
        default:
            res.status(400).json({ message: 'Bad request' });
    }
    
}

const getUsers = async ( req: NextApiRequest, res: NextApiResponse<Data> ) => {

    await db.connect();

    const users = await User.find().select('-password').lean();

    await db.disconnect();

    res.status(200).json( users );
}

const updateUser = async ( req: NextApiRequest, res: NextApiResponse<Data> ) => {

    const { userId = '', role = '' } = req.body;

    if ( !isValidObjectId( userId ) ) return res.status(400).json({ message: 'No existe un usuario con el id solicitado' });

    const validRoles = [ 'client', 'admin', 'super-user', 'SEO' ];

    if ( !validRoles.includes( role ) ){
        return res.status(400).json({ message: `El rol ${ role } no es permitido, los roles válidos son: ${ validRoles.join(',') }` });
    } 

    await db.connect();

    const user = await User.findById( userId );

    if ( !user ){
        await db.disconnect();
        return res.status(404).json({ message: 'No se encontró un usuario con el id solicitado' });
    }

    user.role = role;
    await user.save();

    await db.disconnect();

    return res.status(200).json( { message: 'Usuario actualizado!' } );

}