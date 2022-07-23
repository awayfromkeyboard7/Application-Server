import { getRanking } from '../../../models/db/ranking';

export async function getAllRanking(req, res) {
    try {
        const data = await getRanking();
        res.status(200).json({
        data,
        success: true,
      });
    } catch (err) {
      res.status(409).json({
        success: false,
        message: err.message,
      });
    }
  }