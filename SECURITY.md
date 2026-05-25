# Security Policy

We take the security of OrangeURL and its users seriously. Thank you for taking
the time to responsibly disclose any issues you find.

## Reporting a Vulnerability

Please report security issues by email to **support@orangeurl.live**.

When reporting, please include:

- A clear description of the issue and its impact.
- Steps to reproduce, including any required accounts, payloads, or
  configuration.
- The affected URL, endpoint, or component.
- Your name / handle if you would like to be credited in a public advisory.

Please do **not** open a public GitHub issue for security reports.

## Disclosure Process

- We will acknowledge your report within **5 business days**.
- We will provide an initial assessment (severity, in-scope/out-of-scope)
  within **10 business days**.
- We aim to remediate confirmed vulnerabilities within **90 days** of the
  initial report. Complex issues may take longer; we will keep you updated.
- Once a fix is deployed, we will (with your permission) credit you in the
  release notes or a public advisory.

We ask that you give us a reasonable amount of time to investigate and remediate
before any public disclosure.

## Scope

### In Scope

- `orangeurl.live` (apex / marketing redirect)
- `app.orangeurl.live` (web application)
- `api.orangeurl.live` (backend API)
- The source code in this repository

### Out of Scope

- **Dependency CVEs without a demonstrated exploit chain** against our
  deployment. We track and patch dependencies on a routine cadence; reports
  consisting solely of a CVE ID with no contextual impact will be closed.
- **Social engineering** of OrangeURL staff, contractors, or users.
- **Physical attacks** against OrangeURL infrastructure.
- **Denial-of-service attacks** that rely on raw volume (volumetric DDoS).
  Logic-level DoS (e.g. amplification via a specific endpoint, algorithmic
  complexity attacks) is in scope.
- **Findings from automated scanners** without a working proof of concept.
- **Self-XSS** and issues that require the victim to perform unusual actions
  outside the normal application flow (e.g. pasting attacker-controlled code
  into the browser console).
- **Missing security headers on non-sensitive responses** (e.g. static asset
  caches, public marketing pages) where there is no demonstrated impact.
- **Email spoofing / SPF / DKIM / DMARC** issues on domains we do not send
  mail from.
- **Rate-limit values themselves** (e.g. "you allow 60 req/min, this should
  be 30"). We are happy to discuss thresholds, but the configured limits are
  intentional.

## Safe Harbor

We will not pursue legal action against researchers who:

- Make a good-faith effort to comply with this policy.
- Avoid privacy violations, destruction of data, and interruption or
  degradation of our services.
- Do not access, modify, or retain data belonging to other users beyond what
  is necessary to demonstrate the issue.
- Give us a reasonable opportunity to remediate before any public disclosure.

Thank you for helping keep OrangeURL and our users safe.
