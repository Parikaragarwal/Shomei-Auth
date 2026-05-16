import authorizeController
from "./authorize.js";

export default async function confirmAuthorize(client_id,req) {
    return await authorizeController(client_id,req);
}