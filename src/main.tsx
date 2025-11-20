// src/main.tsx
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { UserProvider, useUser } from "./contexts/UserContext"; // adjust paths if needed

// --- Cognito values (keep in sync with your Cognito App Client settings) ---
const COGNITO_DOMAIN = "us-east-16cauuhmewy.auth.us-east-1.amazoncognito.com";
const REDIRECT_URI = "https://main.d4rmxqdo4.amplifyapp.com/"; // must exactly match Cognito callback URL
// -------------------------------------------------------------------------

// parse URL fragment (#id_token=...&access_token=...)
function parseHashFragment(h: string | null) {
  if (!h) return {};
  if (h.startsWith("#")) h = h.slice(1);
  return Object.fromEntries(h.split("&").filter(Boolean).map(p => p.split("=").map(decodeURIComponent)));
}

// decode JWT payload (demo/quick decode - no signature verification)
function decodeJwtPayload(token: string | null) {
  if (!token) return null;
  try {
    const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = part + "=".repeat((4 - part.length % 4) % 4);
    const json = atob(padded);
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch (e) {
    console.warn("Failed to decode JWT payload", e);
    return null;
  }
}

// optional: call Cognito /oauth2/userInfo to validate access_token (not necessary but useful)
// returns JSON or null
async function fetchUserInfo(accessToken: string) {
  try {
    const res = await fetch(`https://${COGNITO_DOMAIN}/oauth2/userInfo`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error(`userinfo returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("fetchUserInfo error:", err);
    return null;
  }
}

/**
 * InnerBootstrap will run *inside* UserProvider and can call setUser()
 * before rendering the actual App. This ensures any token from Cognito
 * is consumed and the user context is populated.
 */
function InnerBootstrap() {
  // useUser hook should be available because we render this inside UserProvider below
  const { setUser } = useUser();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const frag = parseHashFragment(window.location.hash);
        // If Cognito redirected back with tokens in fragment
        if ((frag as any).id_token) {
          const idToken = (frag as any).id_token as string;
          const accessToken = (frag as any).access_token as string | undefined;
          // persist tokens for session
          sessionStorage.setItem("id_token", idToken);
          if (accessToken) sessionStorage.setItem("access_token", accessToken);
          // remove fragment from URL for cleanliness
          history.replaceState(null, "", window.location.pathname + window.location.search);

          const claims = decodeJwtPayload(idToken);
          if (claims) {
            // set minimal user object into UserContext
            setUser({
              email: claims.email || claims.username,
              name: claims.name || undefined,
              sub: claims.sub,
            });
          }

          // optional: enrich user from userinfo if we have access token
          if (accessToken) {
            const info = await fetchUserInfo(accessToken);
            if (info && info.email) {
              setUser(prev => ({ ...(prev || {}), ...info }));
            }
          }
        } else {
          // No fragment: try to restore from sessionStorage (previous session)
          const existingId = sessionStorage.getItem("id_token");
          const existingAccess = sessionStorage.getItem("access_token");
          if (existingId) {
            const claims = decodeJwtPayload(existingId);
            if (claims) {
              setUser({
                email: claims.email || claims.username,
                name: claims.name || undefined,
                sub: claims.sub,
              });
            }
            if (existingAccess) {
              const info = await fetchUserInfo(existingAccess);
              if (info && info.email) {
                setUser(prev => ({ ...(prev || {}), ...info }));
              }
            }
          }
        }
      } catch (err) {
        console.warn("Auth bootstrap error", err);
      } finally {
        if (mounted) setReady(true);
      }
    })();

    return () => { mounted = false; };
  }, [setUser]);

  // While bootstrapping keep blank to avoid UI flashing; you can render spinner if you like
  if (!ready) return <div />;

  // Render the app normally once bootstrap is done
  return <App />;
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UserProvider>
      <InnerBootstrap />
    </UserProvider>
  </React.StrictMode>
);
