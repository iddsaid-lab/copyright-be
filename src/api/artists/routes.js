import { Artist, User } from '../../models/index.js';

export async function getArtistProfile(req, res, next) {
  try {
    // Get the user for profile details
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      fullName: user.fullName,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      address: user.address,
      phoneNumber: user.phoneNumber,
      nationalIdNumber: user.nationalIdNumber,
      passportNumber: user.passportNumber,
      previousWorkUrl: user.previousWorkUrl
    });
  } catch (err) { next(err); }
}

export async function getAllArtists(req, res, next) {
  try {
    const artists = await User.findAll({ where: { role: 'artist' } });
    res.json(artists);
  } catch (err) { next(err); }
}

export async function updateArtistProfile(req, res, next) {
  try {
    const { bio, country, phone, profilePic } = req.body;
    const artist = await Artist.findOne({ where: { userId: req.user.id } });
    if (!artist) return res.status(404).json({ error: 'Artist profile not found' });
    artist.bio = bio;
    artist.country = country;
    artist.phone = phone;
    artist.profilePic = profilePic;
    await artist.save();
    res.json(artist);
  } catch (err) { next(err); }
}
