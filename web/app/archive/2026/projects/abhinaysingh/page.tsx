'use client';

export default function AbhinaySinghArchivePage() {
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
        <p className="text-2xl font-medium mt-1">Abhinay Singh</p>
      </div>

      {/* Title */}
      <h1 className="font-mono text-4xl md:text-5xl font-bold tracking-tight mb-8">
        Platform Data Analysis
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
          <p className="font-medium">SQL, PostgreSQL, Data Analysis</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">Topics</p>
          <p className="font-medium">Data Analytics, Reporting, Reliability</p>
        </div>
      </div>

      {/* Role / duration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Role</p>
          <p className="font-medium">Data Analyst Intern (Full-time)</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">Duration</p>
          <p className="font-medium">May 20, 2026 – July 20, 2026</p>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-5 text-muted-foreground leading-relaxed max-w-3xl">
        <p>
          Abhinay joined OrangeURL as a Data Analyst Intern, beginning May 20, 2026 and
          ending July 20, 2026. Based out of our Noida office, Sector 62, they worked closely
          with our engineering team, taking ownership of assigned tasks and consistently
          delivering high-quality work.
        </p>
        <p>
          For their project, Abhinay worked on <strong className="text-foreground">SQL-based
          data analysis</strong> for the platform — writing queries against our PostgreSQL
          data to surface insights on link usage, click trends, and platform health. Alongside
          the analysis work, they contributed to feature development, testing, and platform
          reliability, which were a valuable addition to the team.
        </p>
        <p>
          Abhinay demonstrated strong technical ability, a collaborative attitude, and a
          genuine eagerness to learn. We wish them continued success in all future endeavours.
        </p>
      </div>
    </div>
  );
}
