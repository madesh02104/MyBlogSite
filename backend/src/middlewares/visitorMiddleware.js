import { CloudWatchClient, PutMetricDataCommand } from "@aws-sdk/client-cloudwatch";
import crypto from "crypto";

const cloudwatch = new CloudWatchClient({ region: process.env.AWS_REGION || "ap-south-1" });

const SESSION_COOKIE = "_vsid";
const SESSION_TTL_MS = 30 * 60 * 1000;

const sessionStore = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [id, ts] of sessionStore) {
    if (now - ts > SESSION_TTL_MS) sessionStore.delete(id);
  }
}, 10 * 60 * 1000).unref();

async function pushVisitorMetric() {
  try {
    await cloudwatch.send(
      new PutMetricDataCommand({
        Namespace: "Blog/Visitors",
        MetricData: [
          {
            MetricName: "UniqueVisitorCount",
            Value: 1,
            Unit: "Count",
            Timestamp: new Date(),
          },
        ],
      })
    );
  } catch (err) {
    console.error("CloudWatch PutMetricData error:", err.message);
  }
}

export const visitorTracker = (req, res, next) => {
  if (req.method !== "GET") return next();
  if (req.path.startsWith("/api/health") || req.path.startsWith("/api/auth")) return next();

  let sessionId = req.cookies?.[SESSION_COOKIE];
  const isNewSession = !sessionId || !sessionStore.has(sessionId);

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    res.cookie(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: SESSION_TTL_MS,
    });
  }

  sessionStore.set(sessionId, Date.now());

  if (isNewSession) {
    pushVisitorMetric();
  }

  next();
};
