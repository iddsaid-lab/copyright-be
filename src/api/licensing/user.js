import { License, Audio } from '../../models/index.js';

// List all licenses for the logged-in user (as owner or requester)
export async function listMyLicenses(req, res, next) {
  try {
    const licenses = await License.findAll({
      where: {
        $or: [
          { requesterId: req.user.id },
          { ownerId: req.user.id }
        ]
      },
      include: [Audio],
      order: [['createdAt', 'DESC']]
    });
    res.json(licenses);
  } catch (err) { next(err); }
}

// Download certificate (stub)
export async function downloadLicenseCertificate(req, res, next) {
  try {
    // In real implementation, serve the generated PDF
    res.download('public/sample-certificate.pdf', 'license-certificate.pdf');
  } catch (err) { next(err); }
}
