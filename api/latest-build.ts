import { NowRequest, NowResponse } from "@vercel/node";
import fetch from "node-fetch";

export default async (req: NowRequest, res: NowResponse) => {
    res.setHeader("Cache-Control", "no-cache");
    let runs = await fetch(
        "https://api.github.com/repos/terminal-discord/weechat-discord/actions/workflows/1329556/runs"
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
