function verifyPathIdWithAuthenticatedUser(req, res, next) {
  const { role } = req;
  if (role) {
    if ((role === 'ADMIN_ROLE') || (role === 'USER_ROLE' && req.userId.toString() === req.params.id)) {
      return next();
    }
  }
  return res.status(403).send({ error: 'You don\'t have permission to access the resource' });
}

module.exports = verifyPathIdWithAuthenticatedUser;
