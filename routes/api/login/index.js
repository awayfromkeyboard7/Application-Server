const router = require('express').Router();
import { githubLogin } from './controller';

// 깃허브 로그인
router.get('/', githubLogin);

export default router;