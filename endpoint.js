const express = require('express');
const router = express.Router();
const { VM } = require('vm');
const mongoose = require('mongoose');

/**
 * req should have endpoint code
 */
router.post('/endpoint', (req, res) => {
    const endpointCode = req.body.endpoint;

    try {
        const sandbox = {
            mongoose: mongoose,
            console: console, // provide console access
        };

        const vm = new VM({
            sandbox: sandbox,
            timeout: 10000
        });

        const result = vm.run(endpointCode); // endpointCode is expected to be a string of code

        res.send({ result });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

module.exports = router;
