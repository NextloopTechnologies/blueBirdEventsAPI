const express = require('express');
const testController = require('./admin/test');

const router = new express.Router()

router.use('/v1/admin', testController)



module.exports = router
