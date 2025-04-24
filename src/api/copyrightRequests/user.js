import { CopyrightRequest, Audio } from '../../models/index.js';

// List all copyrights for the logged-in artist
export async function listMyCopyrights(req, res, next) {
  try {
    const copyrights = await CopyrightRequest.findAll({
      where: { artistId: req.user.id },
      include: [Audio],
      order: [['createdAt', 'DESC']]
    });
    res.json(copyrights);
  } catch (err) { next(err); }
}

// Download certificate (stub)
export async function downloadCopyrightCertificate(req, res, next) {
  try {
    // In real implementation, serve the generated PDF
    res.download('public/sample-certificate.pdf', 'copyright-certificate.pdf');
  } catch (err) { next(err); }
}
