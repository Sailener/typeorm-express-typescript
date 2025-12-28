import { Router } from 'express';

import { list, show, create, edit, destroy } from '../../controllers/clients';
import { validatorCreateClient } from '../../middleware/validation/clients';

const router = Router();

router.get('/', list);
router.get('/:id([0-9]+)', show);
router.post('/', [validatorCreateClient], create);

router.patch('/:id([0-9]+)', edit);
router.delete('/:id([0-9]+)', destroy);

export default router;
