import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { clerkClient, getAuth } from "@clerk/express";
import { desc } from "drizzle-orm";
import { db, waitlistTable } from "@workspace/db";
import { JoinWaitlistBody } from "@workspace/api-zod";

const router: IRouter = Router();

async function requireAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Google sign-in required." });
    return;
  }
  const configuredEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  const user = await clerkClient.users.getUser(userId);
  const verifiedEmails = user.emailAddresses
    .filter((email) => email.verification?.status === "verified")
    .map((email) => email.emailAddress.trim().toLowerCase());
  if (!verifiedEmails.some((email) => configuredEmails.includes(email))) {
    res.status(403).json({ error: "This Google account is not authorized." });
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

router.get("/waitlist/admin", requireAdmin, async (req, res): Promise<void> => {
  const entries = await db.select().from(waitlistTable).orderBy(desc(waitlistTable.createdAt));
  req.log.info({ count: entries.length }, "Listed waitlist entries");
  res.json(entries);
});

export default router;