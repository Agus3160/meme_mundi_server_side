import { Request } from "express";

export function extractTokenFromHeader(request: Request, typeAuth: string): string | undefined {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === typeAuth ? token : undefined;
}