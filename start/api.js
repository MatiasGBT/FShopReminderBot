module.exports = class Api {
    static startApi() {
        //Necessary so that the build in Render does not fail.
        //This is because Render performs a health check by
        //verifying that the application returns a correct
        //status code (between 200 and 399).
        const PORT = process.env.PORT || 3030;
        const express = require('express');
        const app = express();

        app.get('/', (req, res) => {
            res.sendStatus(200)
        });

        app.listen(PORT, () => {
            console.log(`App listening on port ${PORT}`)
        });
    }
}