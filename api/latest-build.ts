import { NowRequest, NowResponse } from "@vercel/node";
import fetch from "node-fetch";

function isSet(value: any) {
    return value != null && value != "";
}
function isUnset(value: any) {
    return !isSet(value);
}

export default async (req: NowRequest, res: NowResponse) => {
    res.setHeader("Cache-Control", "no-cache");
    let repo = req.query["repo"];
    let workflowId = req.query["workflow"];
    let branch = req.query["branch"];

    if (isUnset(repo)) {
        res.statusCode = 400;
        res.json({ error: "no repo slug provided" });
        return;
    }

    if (isUnset(workflowId)) {
        res.statusCode = 400;
        res.json({ error: "no workflow id provided" });
        return;
    }

    let apiUrl = `https://api.github.com/repos/terminal-discord/${repo}/actions/workflows/${workflowId}/runs`;
    let query_params = {};
    if (isSet(branch)) {
        query_params["branch"] = branch;
    }
    if (new URLSearchParams(query_params).toString() != "") {
        apiUrl += "?" + new URLSearchParams(query_params);
    }

    let runs = await fetch(apiUrl).then((resp) => resp.json());

    let url = runs["workflow_runs"][0]["html_url"];

    if (req.query["redirect"] == "") {
        res.statusCode = 301;
        res.setHeader("Location", url);
        res.json({});
    } else {
        res.json({ url, r: req.query["redirect"] });
    }
};
