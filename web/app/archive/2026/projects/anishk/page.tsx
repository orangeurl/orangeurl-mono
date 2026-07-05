'use client';

export default function AnishKumarArchivePage() {
  return (
    <div className="max-w-5xl mx-auto px-2 py-8 md:py-12">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground mb-10">
        <span className="underline underline-offset-4">2026 Program</span>
        <span className="mx-2">|</span>
        <span className="underline underline-offset-4">OrangeURL</span>
      </div>

      {/* Contributor */}
      <div className="mb-8">
        <p className="text-sm text-muted-foreground">Contributor</p>
        <p className="text-2xl font-medium mt-1">Anish Kumar</p>
      </div>

      {/* Title */}
      <h1 className="font-mono text-4xl md:text-5xl font-bold tracking-tight mb-8">
        Zapier Integration
      </h1>

      <hr className="border-border/60 mb-10" />

      {/* Meta grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Mentor</p>
          <p className="font-medium">Praveen Vaishya</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">Organization</p>
          <p className="font-medium">OrangeURL</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">Technologies</p>
          <p className="font-medium">Go, TypeScript, Webhooks, Zapier Platform</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">Topics</p>
          <p className="font-medium">Integrations, Automation, APIs</p>
        </div>
      </div>

      {/* Role / duration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Role</p>
          <p className="font-medium">Software Development Intern (Full-time)</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">Duration</p>
          <p className="font-medium">May 20, 2026 – June 25, 2026</p>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-5 text-muted-foreground leading-relaxed max-w-3xl">
        <p>
          Anish joined OrangeURL as a Software Development Intern, beginning May 20, 2026
          and ending June 25, 2026. Over the course of this full-time internship, they
          worked closely with our engineering team, taking ownership of assigned tasks and
          consistently delivering high-quality work.
        </p>
        <p>
          For their project, Anish implemented the <strong className="text-foreground">Zapier
          integration</strong> — connecting OrangeURL to thousands of apps so users can
          automate their link workflows. The work included defining triggers and actions on
          the Zapier platform (such as creating a short link or firing on new clicks), wiring
          them to the OrangeURL API and webhook events, handling authentication, and testing
          the integration end-to-end for publication.
        </p>
        <p>
          Anish was a reliable, self-directed contributor and shipped a feature that is now
          part of OrangeURL&apos;s product. We wish them the best in their career.
        </p>
      </div>
    </div>
  );
}
