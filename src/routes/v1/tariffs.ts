import { Router } from 'express';

import { list, show, create, edit, destroy } from '../../controllers/tariffs';
import { validatorCreateTariff } from '../../middleware/validation/tariffs';

const router = Router();

router.get('/', list);
router.get('/:id([0-9]+)', show);
router.post('/', [validatorCreateTariff], create);

router.patch('/:id([0-9]+)', edit);
router.delete('/:id([0-9]+)', destroy);

export default router;
