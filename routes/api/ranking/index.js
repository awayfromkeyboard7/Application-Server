const router = require('express').Router();
import { getAllRanking } from './controller';

router.get('/getRanking', getAllRanking);

export default router;