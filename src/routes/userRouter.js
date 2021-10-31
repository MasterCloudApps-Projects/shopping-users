const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {

    const userId = 1;
    res.header('Location', req.protocol + '://' + req.get('host') + req.originalUrl + '/' + userId)
        .status(201)
        .json({ id: userId });

});

module.exports = router;