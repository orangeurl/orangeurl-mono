'use client';

export default function JagjeetSinghArchivePage() {
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
        <p className="text-2xl font-medium mt-1">Jagjeet Singh</p>
      </div>

      {/* Title */}
      <h1 className="font-mono text-4xl md:text-5xl font-bold tracking-tight mb-8">
        Data Quality Monitoring
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
          <p className="font-medium">SQL, PostgreSQL, Data Analysis</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">Topics</p>
          <p className="font-medium">Data Quality, Monitoring, Reliability</p>
        </div>
      </div>

      {/* Role / duration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Role</p>
          <p className="font-medium">Data Analyst Intern (Full-time, Remote)</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">Duration</p>
          <p className="font-medium">May 20, 2026 – July 20, 2026</p>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-5 text-muted-foreground leading-relaxed max-w-3xl">
        <p>
          Jagjeet joined OrangeURL as a Data Analyst Intern, beginning May 20, 2026 and
          ending July 20, 2026. Over the course of this full-time remote internship, they
          worked closely with our engineering team, taking ownership of assigned tasks and
          consistently delivering high-quality work.
        </p>
        <p>
          For their project, Jagjeet worked on <strong className="text-foreground">Data
          Quality Monitoring</strong> — building checks and reporting to catch anomalies in
          the platform&apos;s data, such as missing or malformed records, duplicate entries,
          and inconsistencies in click and link data. The work helped the team trust its
          analytics and surface issues before they affected reporting.
        </p>
        <p>
          Jagjeet demonstrated strong technical ability and a genuine eagerness to learn, and
          their contribution was a valuable addition to the team. We wish them continued
          success in all future endeavours.
        </p>
      </div>
    </div>
  );
}
