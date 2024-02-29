import { Elysia } from "elysia";
import { Google } from "arctic";
import { generateState, generateCodeVerifier } from "arctic";
import { serializeCookie } from "oslo/cookie";

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  "http://localhost:3000/login/google/callback"
);

export const auth = new Elysia({ prefix: "/login" })
  .get(
    "/google",
    async ({ set, cookie: { google_state, google_code_verifier } }) => {
      const state = generateState();
      const codeVerifier = generateCodeVerifier();
      const url = await google.createAuthorizationURL(codeVerifier, state);

      google_state.value = state;
      google_state.set = {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 10,
        path: "/",
      };

      google_code_verifier.value = codeVerifier;
      google_code_verifier.set = {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 10,
        path: "/",
      };

      return (set.redirect = url.toString());
    }
  )
  .get("/google/callback", () => {
    return "handling google callback";
  });
