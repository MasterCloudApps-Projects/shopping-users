function verifyPathIdWithAuthenticatedUser(req, res, next) {
  const { id } = req.params;

  if (req.userId.toString() !== id) {
    return res.status(403).send({ error: 'You don\'t have permission to access the resource' });
  }

  return next();
}

module.exports = verifyPathIdWithAuthenticatedUser;
