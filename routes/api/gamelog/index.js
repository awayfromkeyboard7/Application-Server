const router = require('express').Router();
import { updateGamelog, createGamelog, getGamelog, updateGamelogTeam } from './controller';

router.post('/update', updateGamelog);
router.post('/createNew', createGamelog);
router.post('/getGameLog', getGamelog);
router.post('/updateTeam', updateGamelogTeam);

export default router;