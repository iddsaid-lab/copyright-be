import { CopyrightRequest } from '../../models/index.js';

// Get audit trail for a copyright request
export async function getCopyrightAuditTrail(req, res, next) {
  try {
    const request = await CopyrightRequest.findByPk(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    res.json({ processedBy: request.processedBy || [] });
  } catch (err) { next(err); }
}
