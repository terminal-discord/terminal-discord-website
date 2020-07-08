import { NowRequest, NowResponse } from "@vercel/node";
import fetch from "node-fetch";

export default async (req: NowRequest, res: NowResponse) => {
    res.setHeader("Cache-Control", "no-cache");
    let repo = req.query["repo"];
    let workflow_id = req.query["workflow"];

    if (repo == null || repo == "") {
        res.statusCode = 400;
        res.json({ error: "no repo slug provided" });
        return;
    }

    if (workflow_id == null || workflow_id == "") {
        res.statusCode = 400;
        res.json({ error: "no workflow id provided" });
        return;
    }

    let runs = await fetch(
        `https://api.github.com/repos/terminal-discord/${repo}/actions/workflows/${workflow_id}/runs`
    ).then((resp) => resp.json());

    let url = runs["workflow_runs"][0]["html_url"];

    if (req.query["redirect"] == "") {
        res.statusCode = 301;
        res.setHeader("Location", url);
        res.json({});
    } else {
        res.json({ url, r: req.query["redirect"] });
    }
};
