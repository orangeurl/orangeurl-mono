'use client';

export default function AshishMeenaArchivePage() {
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
        <p className="text-2xl font-medium mt-1">Ashish Meena</p>
      </div>

      {/* Title */}
      <h1 className="font-mono text-4xl md:text-5xl font-bold tracking-tight mb-8">
        UTM Campaign Builder
      </h1>

      <hr className="border-border/60 mb-10" />

      {/* Meta grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Mentor</p>
          <p className="font-medium">Arman Singh</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">Organization</p>
          <p className="font-medium">OrangeURL</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">Technologies</p>
          <p className="font-medium">Next.js, TypeScript, React, Tailwind CSS</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">Topics</p>
          <p className="font-medium">Web, Marketing Tools, UI/UX</p>
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
          <p className="font-medium">May 15, 2026 – July 15, 2026</p>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-5 text-muted-foreground leading-relaxed max-w-3xl">
        <p>
          Ashish joined OrangeURL as a Software Development Intern, beginning May 15, 2026
          and ending July 15, 2026. Over the course of this full-time internship, they
          worked closely with our engineering team, taking ownership of assigned tasks and
          consistently delivering high-quality work.
        </p>
        <p>
          For their project, Ashish built the <strong className="text-foreground">UTM
          Campaign Builder</strong> — a self-serve tool that lets users attach campaign
          tracking parameters (utm_source, utm_medium, utm_campaign, utm_term, utm_content)
          to a destination URL before shortening it, so they can measure where their
          traffic comes from. The work included a clean form UI with a live preview of the
          final tagged URL, client-side validation and URL encoding to keep generated links
          valid, a one-click hand-off into the existing OrangeURL shortening flow, and
          presets for common sources to speed up repetitive campaign setup.
        </p>
        <p>
          Ashish was a reliable, self-directed contributor and shipped a feature that is now
          part of OrangeURL&apos;s product. We wish them the best in their career.
        </p>
      </div>
    </div>
  );
}
