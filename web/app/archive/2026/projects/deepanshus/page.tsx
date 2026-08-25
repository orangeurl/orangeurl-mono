'use client';

export default function DeepanshuSrivastavaArchivePage() {
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
        <p className="text-2xl font-medium mt-1">Deepanshu Srivastava</p>
      </div>

      {/* Title */}
      <h1 className="font-mono text-4xl md:text-5xl font-bold tracking-tight mb-8">
        URL Shortener Clickstream &amp; Traffic Analytics
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
          <p className="font-medium">Clickstream, Traffic Analytics, Reporting</p>
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
          <p className="font-medium">June 1, 2026 – July 31, 2026</p>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-5 text-muted-foreground leading-relaxed max-w-3xl">
        <p>
          Deepanshu joined OrangeURL as a Software Development Intern, beginning June 1,
          2026 and ending July 31, 2026. Over the course of this full-time internship,
          based out of our Noida Office, Sector 62, they worked closely with our engineering
          team, taking ownership of assigned tasks and consistently delivering high-quality
          work.
        </p>
        <p>
          For their project, Deepanshu worked on{' '}
          <strong className="text-foreground">
            URL Shortener Clickstream &amp; Traffic Analytics
          </strong>
          , a data analytics project focused on the development and improvement of our URL
          shortening platform and related services. Their contributions to feature
          development, testing, and platform reliability were a valuable addition to the
          team.
        </p>
        <p>
          During this period, Deepanshu demonstrated strong technical ability, a
          collaborative attitude, and a genuine eagerness to learn. We wish them continued
          success in all future endeavours.
        </p>
      </div>
    </div>
  );
}
