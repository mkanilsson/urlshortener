import express, { Request, Response, NextFunction, Application } from "express";
import Logger from "./utils/Logger";
import mongoose from "mongoose";
import { nanoid } from "nanoid";
import * as path from "path";

// Models
import Url from "./models/url";

// Init Logger
Logger.init("log.txt");

// Connect to Database
mongoose.connect(
    "mongodb://localhost:27017/urlshortener",
    { useNewUrlParser: true, useUnifiedTopology: true },
    err => {
        if (err) {
            Logger.error(err.toString());
            process.exit(1);
            return;
        }

        Logger.log("Connected to Database");
    }
);

// Create app and Initialize Middleware
const app: express.Application = express();

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true
    })
);

// GET / - Return Home page
app.get("/", async (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../views', '/index.html'));
});

// GET /:slug - Redirect to url och to / if no slug matched
app.get("/:slug", async (req: Request, res: Response) => {
    if (req.params.slug == undefined) return res.redirect("/");

    let obj = await Url.findOne({ slug: req.params.slug });

    if (obj == undefined) return res.redirect("/");

    res.redirect(obj.url);
});

//POST /api/ - Create new short url
//TODO: Ability to add custom slug, make sure it's uniqe
app.post("/api/", async (req: Request, res: Response) => {
    if (req.body.url == undefined) {
        return res.json({
            error: {
                message: "URL is required"
            }
        });
    }

    let obj = await Url.findOne({ url: req.body.url });
    const slug = nanoid(5);

    if (obj == undefined) {
        obj = await Url.create({ url: req.body.url, slug });
        Logger.log("New short url created, Id: " + obj._id);
    }

    res.json({ data: obj });
});

// GET /api/:slug - Get database object to be used for redirect
app.get("/api/:slug", async (req: Request, res: Response) => {
    if (req.params.slug == undefined)
        return res.json({
            error: {
                message: "Slug is required"
            }
        });

    let obj = await Url.findOne({ slug: req.params.slug });

    if (obj == undefined)
        return res.json({
            error: {
                message: "Url with that slug not found"
            }
        });

    res.json({ data: obj });
});

// Start HTTP Server
app.listen(5000, () => Logger.log("Server listening on port 5000"));
