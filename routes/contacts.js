const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Get all the contacts.');
});

router.post('/', (req, res) => {
    res.send('Add new Contact.');
});

router.put('/:id', (req, res) => {
    res.send('Update the Contact.');
});

router.delete('/:id', (req, res) => {
    res.send('Delete the Contact.');
});

module.exports = router;