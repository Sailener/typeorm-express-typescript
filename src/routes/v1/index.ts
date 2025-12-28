import { Router } from 'express';

import auth from './auth';
import clients from './clients';
import devices from './devices';
import subscriptions from './subscriptions';
import tariffs from './tariffs';
import users from './users';

const router = Router();
router.use('/auth', auth);
router.use('/users', users);
router.use('/tariffs', tariffs);
router.use('/clients', clients);
router.use('/subscriptions', subscriptions);
router.use('/devices', devices);

export default router;
