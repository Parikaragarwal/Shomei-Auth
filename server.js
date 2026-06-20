import cors from "cors";
import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "node:url";
import path from "node:path";
import "dotenv/config"

import * as routeHandlers from './src/routes.js';
import { authLimiter, apiLimiter ,emailLimiter} from './src/middlewares/rateLimiter.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");

app.set(
    "views",
    path.join(__dirname, "src", "views")
);

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

app.use(express.json());
app.use(urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// Apply global rate limiting
app.use(apiLimiter);


    app.get('/',(req,res)=>{
        return res.end(JSON.stringify({message: "Welcome to the OIDC Authentication Server"}));
    });
    app.get("/.well-known/openid-configuration", routeHandlers.openidConfigurationHandler);
    app.get("/public-keys", routeHandlers.publicKeysHandler);
    app.get("/userinfo", routeHandlers.userInfoHandler);
    
    app.get("/authorize/:id",routeHandlers.showAuthorizePageHandler);
    app.post("/authorize/confirm",routeHandlers.confirmAuthorizeHandler);
    app.post("/authorize/deny",routeHandlers.denyAuthorizeHandler);
    app.post("/verify-otp", authLimiter,emailLimiter ,routeHandlers.verifyOTP);

    app.post("/token-exchange", routeHandlers.tokenExchangeHandler);
    app.post("/client-signup", routeHandlers.clientSignupHandler);
    app.post("/user-signup", authLimiter,emailLimiter, routeHandlers.userSignupHandler);
    app.post("/login", authLimiter,emailLimiter, routeHandlers.loginHandler);
    app.post("/logout", routeHandlers.logoutHandler);
    app.post("/logout-all", routeHandlers.logoutAllHandler);
    app.post("/forgot-password", emailLimiter, routeHandlers.forgotPasswordHandler);
    app.post("/reset-password", authLimiter, emailLimiter, routeHandlers.resetPasswordHandler);

    // Dashboard endpoints
    app.get("/api/user/sessions", routeHandlers.getUserSessionsHandler);
    app.delete("/api/user/sessions/:clientId", routeHandlers.revokeAppAccessHandler);
    app.get("/api/clients", routeHandlers.getUserClientsHandler);
    app.get("/api/clients/:clientId/users", routeHandlers.getClientUsersHandler);
    app.get("/api/clients/:clientId/public", routeHandlers.getPublicClientInfoHandler);


app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.get("/client-signup", (req, res) => {
    res.render("client-signup");
});


app.listen(process.env.PORT || 3371, ()=>{
    console.log(`Server is running on port ${process.env.PORT || 3371}`);
});

