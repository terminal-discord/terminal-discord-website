# Terminal Discord

This is the source for the Terminal Discord site.

Currently it only provides a simple api:
* `/api/latest-build?repo={repo}&workflow={workflow_id}&branch={branch}` - Used to provide easy, direct access to the latest build artifacts. (branch is optional) 
* `/api/lookup-user?id={user_id}` - Proxies the discord api `/users/{user.id}` endpoint.  Used by the token finding script to report the username the token belongs to.