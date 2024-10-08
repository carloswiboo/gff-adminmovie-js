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
export function createToken(userInfo) {
  try {
    return new SignJWT(userInfo)
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setIssuer(process.env.TOKEN_AUDIENCE)
      .setAudience(process.env.TOKEN_AUDIENCE)
      .setExpirationTime(process.env.TOKEN_EXPIRATION_TIME)
      .sign(KEY);
  } catch (e) {
    console.log("e:", e);
    return null;
  }
}

export async function verifyToken(token) {

  try {
    const { payload } = await jwtVerify(token, KEY, {
      issuer: process.env.TOKEN_ISSUER,
      audience: process.env.TOKEN_AUDIENCE,
    });
    return payload;
  } catch (e) {
    console.error("Token verification failed:", e.message);
    return null;
  }
}
