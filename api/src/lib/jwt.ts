import { createHmac, createSign } from "crypto";

const SECRET = process.env.SECRET || "this is not good enough";

type JWTHeader = {
  alg: string; // "HS256" for example
  typ: string; // Always "JWT"
};

type JWTPayload = {
  sub: string; // userid
  iat: number; // issued time
  exp: number; // expiration date
  name: string; // username
  admin: boolean; // user type
};

function encodeBase64(str: string) {
  return Buffer.from(str, "utf-8").toString("base64url");
}

function decodeBase64(str: string) {
  return Buffer.from(str, "base64url").toString("utf-8");
}

function buildJwtToken(
  sub: string,
  name: string,
  expiration: number = 604800,
  admin: boolean = false
) {
  // encode header
  const header: string = buildJWTHeader();
  // encode payload
  const payload: string = buildJWTPayload(sub, name, admin, expiration);
  // create signture
  const signature: string = buildSignature(header, payload, "SHA256");
  console.log([header, payload, signature].join("."));
  return [header, payload, signature].join(".");
}

type ALGO = "SHA256" | "SHA512";

function buildJWTHeader(hashEncoding: ALGO = "SHA256") {
  const typ = "JWT";
  const alg = hashEncoding;
  const header: JWTHeader = { typ, alg };
  return encodeBase64(JSON.stringify(header));
}

function buildJWTPayload(
  sub: string,
  name: string,
  admin: boolean,
  expiration: number = 604800 // number of secs till expire
) {
  const exp = Math.floor(Date.now() / 1000 + expiration);
  const iat = Math.floor(Date.now() / 1000);
  const payload: JWTPayload = { sub, name, admin, exp, iat };
  return encodeBase64(JSON.stringify(payload));
}

function buildSignature(header: string, payload: string, algo: ALGO) {
  const hmac = createHmac(algo.toLocaleLowerCase(), SECRET);
  console.log([header, payload, SECRET].join("."));
  const ret = hmac.update([header, payload, SECRET].join(".")).digest("hex");
  console.log(ret);
  return ret;
}

function compareSignatures(header: string, payload: string, signature: string) {
  const newSignature = buildSignature(header, payload, "SHA256");
  return newSignature.localeCompare(signature);
}

//TODO Update token if less then 50% left
//TODO Return invalid token if passed expiration date
function readJwtToken(token: string) {
  if (token.match(/./g)?.length !== 2) throw "Invalid token string";
  const split: string[] = token.split(".");
  const header = split[0];
  const payload = split[1];
  const signature = split[2];
  if (!compareSignatures(header, payload, signature))
    throw "Invalid token signature!!!";
  return decodeBase64(payload);
}

export { buildJwtToken, readJwtToken };
