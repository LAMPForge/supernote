import * as path from 'path';
import * as bcrypt from 'bcrypt';

export const envPath = path.resolve(process.cwd(), '..', '..', '.env');

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}