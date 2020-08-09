import { NowRequest, NowResponse } from "@vercel/node";
import fetch from "node-fetch";

function isSet(value) {
    return value != null && value != "";
}
function isUnset(value) {
    return !isSet(value);
}

export default async (req: NowRequest, res: NowResponse) => {
    res.setHeader("Cache-Control", "no-cache");
    let repo = req.query["repo"];
    let workflow_id = req.query["workflow"];
    let branch = req.query["branch"];

    if (isUnset(repo)) {
        res.statusCode = 400;
        res.json({ error: "no repo slug provided" });
        return;
    }

    if (isUnset(workflow_id)) {
        res.statusCode = 400;
        res.json({ error: "no workflow id provided" });
        return;
    }

    let api_url = `https://api.github.com/repos/terminal-discord/${repo}/actions/workflows/${workflow_id}/runs`;
    let query_params = {};
    if (isSet(branch)) {
        query_params["branch"] = branch;
    }
    console.log(query_params);
    if (new URLSearchParams(query_params).toString() != "") {
        api_url += "?" + new URLSearchParams(query_params);
    }

    let runs = await fetch(api_url).then((resp) => resp.json());

    let url = runs["workflow_runs"][0]["html_url"];

    if (req.query["redirect"] == "") {
        res.statusCode = 301;
        res.setHeader("Location", url);
        res.json({});
    } else {
        res.json({ url, r: req.query["redirect"] });
    }
};
