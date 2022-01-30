let router = require('express').Router();
let { post_orgs, get_orgs } = require('../controllers/organisation.controller');
let { wrap } = require('../../utils/error_handler');

router.post('/', wrap(post_orgs));
router.get('/:organization_name', wrap(get_orgs));

module.exports = router;
