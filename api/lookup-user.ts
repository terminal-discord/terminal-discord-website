import { NowRequest, NowResponse } from "@vercel/node";
import fetch from "node-fetch";

function isSet(value: any) {
    return value != null && value != "";
}
function isUnset(value: any) {
    return !isSet(value);
}

export default async (req: NowRequest, res: NowResponse) => {
    let id = req.query["id"];

    if (isUnset(id)) {
        res.statusCode = 400;
        res.json({ error: "no user id provided" });
        return;
    }

    let apiResp = await fetch(`https://discord.com/api/v8/users/${id}`, {
        headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
    });
    res.statusCode = apiResp.status;

    res.json(await apiResp.json());
};
