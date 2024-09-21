import { SignJWT, jwtVerify } from "jose";

/* JWT secret key */
let KEY = process.env.JWT_KEY;

KEY = new TextEncoder().encode(KEY);
const alg = "HS256";
/* End JWT Secret Key */

/*
 * @params {jwtToken} extracted from cookies
 * @return {object} object of extracted token
 */
export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, KEY, {
      issuer: process.env.TOKEN_AUDIENCE,
      audience: process.env.TOKEN_AUDIENCE,
    });
    return payload;
  } catch (e) {
    console.log("Token verification failed:", e);
    return null;
  }
}
