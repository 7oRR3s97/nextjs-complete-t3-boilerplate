import "server-only";

import { PostHog } from "posthog-node";

function serverSidePostHog() {
  const serverPosthogClient = new PostHog(process.env.POSTHOG_KEY ?? "", {
    host: process.env.POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  });

  return serverPosthogClient;
}

const posthog = serverSidePostHog();

export default posthog;
