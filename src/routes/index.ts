import * as express from "express";

const router = express.Router();

// This route return the logged-in user's profile.
router.get("/", function (req, res) {
    res.json(req.user);
});

export = router;
