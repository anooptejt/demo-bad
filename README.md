# demo-bad

Sample Node web app (a payments console with a small UI) used to demo repository onboarding and self-healing with ZenseAI AIDLC Centre. This is the **bad** app: it onboards and deploys cleanly, but its next release crashes.

## Run locally

```bash
npm start        # http://localhost:8080
npm test
```

Endpoints: `/` (UI), `/api/info`, `/healthz`, `/readyz`.

## What is deliberately missing

This repository has no `Dockerfile`, no Kubernetes manifests and no CI workflow. Onboarding through the platform creates and commits those, and the first CI run builds and pushes `quay.io/anoop_thotapalli/demo-bad`.

## Releases

- `main` is **v1.0.0**, which is healthy. This is the last good tag.
- Branch `release/1.1.0` is the **bad** release: it exits at startup because `PAYMENT_GATEWAY_URL` is not configured, so the pod goes into CrashLoopBackOff. Merge it to demo the agent diagnosing the failure and proposing a rollback to 1.0.0.
