const router = require('express').Router();
import { sendCode } from "./controller";

// 채점 서버
router.post('/', sendCode);
export default router;