const cookie = require("cookie");

import authApi from "@/scripts/auth/authApi";

async function authPage() {
    try {
        const response = await authApi.get("/auth/check");
        return response.status === 200;
    } catch (error) {
        return false;
    }
}

export default authPage;

