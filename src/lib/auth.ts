import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.SESSION_SECRET || 'your-super-secret-key-that-is-at-least-32-bytes-long';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d') // Set session to expire in one day
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    // This will be caught for expired tokens or invalid tokens.
    return null;
  }
}
