// src/pages/api/users.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '../../server/entities/User';

const users = async (req: NextApiRequest, res: NextApiResponse) => {
	const examples = await User.find();
	res.status(200).json(examples);
};

export default users;
