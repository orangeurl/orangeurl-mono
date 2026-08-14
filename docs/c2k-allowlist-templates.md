# C2k / EdIS allow-list request templates

Templates for getting **orangeurl.live** un-blocked on the C2k managed network
that Northern Ireland schools and colleges run on. Filtering on C2k is central,
so one successful allow-list decision unblocks the domain across *every* school
at once — this is the highest-leverage thing to chase.

## How the process works (read first)

- Individual teachers usually **cannot** change filtering themselves. The
  request has to reach the **C2k Service Desk** (operated for the Education
  Authority NI), and it lands fastest when it comes from — or is co-signed by —
  the school's **C2k Coordinator / Designated ICT contact** or Senior Leadership.
- So there are two paths:
  1. **Teacher → their own school's C2k Coordinator → C2k Service Desk** (best).
  2. **You (orangeurl) → C2k Service Desk directly**, as the site owner
     requesting categorisation review. Use Template C for this.
- Always ask for a **domain-level** allow-list of `*.orangeurl.live`
  (apex + `app.` + `api.`), not a single link, or every new short link stays
  blocked.
- Keep the tone factual and safeguarding-forward. The reviewer's first question
  is always "is this safe for children?" — answer it before they ask.

---

## Template A — Teacher → school C2k Coordinator / ICT contact

> **Subject:** Request to allow-list orangeurl.live on our C2k filtering
>
> Hi [Coordinator name],
>
> I use short links from **orangeurl.live** to share resources with my classes
> (e.g. handouts, lesson links, sign-up forms). Pupils and I are finding the
> links won't open on the school network — they appear to be blocked by our
> C2k web filtering, most likely under a "URL shortener / redirector" category.
>
> Could you please raise a request with the **C2k Service Desk** to allow-list
> the domain **`*.orangeurl.live`** (this covers the short links plus the
> `app.` and `api.` subdomains the service needs) for educational use?
>
> I've attached a short summary from the service provider covering what the tool
> is and the safety controls it has, which the Service Desk will want. Happy to
> provide anything else they need.
>
> Thanks very much,
> [Your name] — [Subject / Department], [School]

---

## Template B — School C2k Coordinator → C2k Service Desk

> **Subject:** Web-filtering allow-list request — orangeurl.live (educational use)
>
> Hello C2k Service Desk,
>
> **School:** [School name]
> **C2k reference / DE number:** [if known]
> **Requested by:** [Name, role]
>
> **Request:** Please review the categorisation of, and allow-list, the domain
> **`*.orangeurl.live`** (apex `orangeurl.live`, plus `app.orangeurl.live` and
> `api.orangeurl.live`) for our school, for staff and pupil use.
>
> **What it is:** orangeurl.live is a URL-shortening service used by our staff to
> share lesson resources, forms and links with classes. It currently appears to
> be blocked, we believe under a generic "URL shortener / proxy" category rather
> than for any specific content reason.
>
> **Why we need it:** [1–2 lines — e.g. "Staff in [dept] distribute lesson
> materials via these links and pupils cannot currently open them in class."]
>
> **Safety / safeguarding:** The provider has confirmed the service includes
> active abuse controls (summary attached): automated rejection of known
> phishing domains and high-abuse TLDs when links are created, an abuse-report
> and rapid-takedown process, a safety warning interstitial on any flagged link,
> and rate-limiting to prevent bulk misuse.
>
> Please advise if you need anything further to progress this. Many thanks,
> [Name, role, contact]

---

## Template C — orangeurl (site owner) → C2k Service Desk / categorisation review

Use this to approach C2k yourself as the domain owner. Send from an
`@orangeurl.live` address if you have one — it lends credibility.

> **Subject:** Site categorisation review request — orangeurl.live (site owner)
>
> Hello,
>
> I'm the operator of **orangeurl.live**, a UK-based URL-shortening service. A
> number of Northern Ireland schools have reported that our links are blocked on
> the C2k network, which we believe is due to a blanket "URL shortener /
> redirector" classification rather than any specific content on our domain.
>
> I'd like to request a **categorisation review and allow-listing** of
> **`*.orangeurl.live`** for educational use. To support that, here is a summary
> of the safety controls built into the service:
>
> - **Creation-time filtering** — links pointing to known phishing/abuse domains
>   and high-abuse TLDs are automatically rejected and never created.
> - **Abuse reporting + rapid takedown** — reported links are blocked promptly
>   and resolve to a block page instead of the destination.
> - **Safety interstitial** — links flagged as suspicious show a warning page to
>   the visitor before any redirect, rather than silently forwarding.
> - **Rate limiting** — per-client limits prevent automated bulk abuse.
> - **Contactable operator** — we action safeguarding/abuse reports sent to
>   [abuse@orangeurl.live / your contact].
>
> I'm happy to complete any vetting process you use for educational suppliers,
> provide an abuse point-of-contact, or supply further detail. Could you let me
> know the right process to have the domain reviewed for the C2k network?
>
> Kind regards,
> [Name] — orangeurl.live
> [Contact email] · [Website]

---

## Template D — Follow-up / escalation if the first request is declined

> **Subject:** Re: allow-list request — orangeurl.live — additional information
>
> Thank you for looking at this. I understand URL shorteners are filtered as a
> category by default. I'd like to ask that **orangeurl.live be assessed on its
> own merits** rather than the category, on the following grounds:
>
> - It is used for a legitimate educational purpose at [School] — [1 line].
> - It is not an open proxy or anonymiser: it only forwards to destination URLs,
>   applies creation-time filtering against known-bad domains/TLDs, and operates
>   an abuse-report/takedown process with a named contact.
> - Flagged links present a safety interstitial rather than forwarding silently.
>
> If a domain-wide allow-list isn't possible, would a **per-school allow-list**
> for [School] be acceptable? We're also willing to complete any supplier
> assurance or safeguarding checklist you use. Who would be the right person to
> take this forward?
>
> Thank you,
> [Name, role]

---

## Fill-in checklist (before sending any of the above)

- [ ] Replace every `[bracketed]` field.
- [ ] Request **`*.orangeurl.live`** (domain-level), never a single short link.
- [ ] Name the three hostnames: `orangeurl.live`, `app.orangeurl.live`,
      `api.orangeurl.live`.
- [ ] Attach / paste the safety-controls summary (Template C's bullet list).
- [ ] Set up and cite a real **abuse contact** (e.g. `abuse@orangeurl.live`)
      before sending Template C — reviewers check it exists.
- [ ] Give the teacher/coordinator a one-line "why we need it in class" reason;
      generic requests get deprioritised.

## Parallel move (do this too)

C2k, like most UK/NI school networks, buys its categorisation feed from
commercial filter vendors. Submitting the domain for re-categorisation with the
big vendors improves your reputation everywhere at once. Look for each vendor's
"submit a site / dispute categorisation" form and ask to be moved out of
*URL Shortener/Proxy* into *Business/Technology*:
Fortinet FortiGuard · Smoothwall/Qoria · Securly · Lightspeed Systems ·
Netsweeper · Cisco Talos/Umbrella · Palo Alto · Zscaler.
