const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
	res.render('index', { title: 'Home' });
});
router.get('/public/css/style.css', (req, res) => {
	res.sendFile(path.join(process.env.ROOT_DIR, '/public/css/style.css'));
});

module.exports = router;
