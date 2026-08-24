import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import cookieParser from "cookie-parser";
import crypto from "node:crypto";
import { eq, desc } from "drizzle-orm";
import { db, waitlistTable } from "@workspace/db";
import { JoinWaitlistBody, WaitlistAdminLoginBody } from "@workspace/api-zod";

const router: IRouter = Router();
const SESSION_MAX_AGE = 60 * 60 * 8;

router.use(cookieParser());

function sessionToken(): string {
  const expires = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const secret = process.env.ADMIN_PASSWORD ?? process.env.SESSION_SECRET;
  if (!secret) return "";
  const payload = String(expires);
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${signature}`;
}

function isAdminSession(req: Request): boolean {
  const token = req.cookies?.waitlist_admin;
  const secret = process.env.ADMIN_PASSWORD ?? process.env.SESSION_SECRET;
  if (!token || !secret) return false;
  const [expires, signature] = String(token).split(".");
  if (!expires || !signature || Number(expires) < Math.floor(Date.now() / 1000)) return false;
  const expected = crypto.createHmac("sha256", secret).update(expires).digest("hex");
  return signature.length === expected.length && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!isAdminSession(req)) {
    res.status(401).json({ error: "Admin authentication required" });
    return;
  }
  next();
}

router.post("/waitlist", async (req, res): Promise<void> => {
  const parsed = JoinWaitlistBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Please provide a valid email address." });
    return;
  }
  try {
    const [entry] = await db
      .insert(waitlistTable)
      .values({ email: parsed.data.email.trim().toLowerCase() })
      .returning();
    res.status(201).json(entry);
  } catch (error) {
    if (error instanceof Error && error.message.includes("unique")) {
      res.status(409).json({ error: "This email is already on the waitlist." });
      return;
    }
    req.log.error({ err: error }, "Failed to add waitlist entry");
    res.status(500).json({ error: "Unable to join the waitlist right now." });
  }
});

router.post("/waitlist/admin/login", (req, res): void => {
  const parsed = WaitlistAdminLoginBody.safeParse(req.body);
  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (!configuredPassword || !parsed.success || parsed.data.password !== configuredPassword) {
    res.status(401).json({ error: "Invalid admin password." });
    return;
  }
  res.cookie("waitlist_admin", sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE * 1000,
  });
  res.json({ authenticated: true });
});

router.get("/waitlist/admin", requireAdmin, async (req, res): Promise<void> => {
  const entries = await db.select().from(waitlistTable).orderBy(desc(waitlistTable.createdAt));
  req.log.info({ count: entries.length }, "Listed waitlist entries");
  res.json(entries);
});

export default router;