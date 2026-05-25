import { ImageResponse } from 'next/og';

// Image metadata
export const alt = 'OrangeURL - Fast & Secure URL Shortener';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 50%, #FED7AA 100%)',
          padding: '60px 80px',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '24px',
              boxShadow: '0 10px 30px rgba(234, 88, 12, 0.3)',
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div
            style={{
              fontSize: '48px',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #EA580C 0%, #F97316 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              letterSpacing: '-0.02em',
            }}
          >
            OrangeURL
          </div>
        </div>

        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
          <div
            style={{
              fontSize: '32px',
              color: '#F97316',
              fontWeight: 600,
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Features
          </div>
          <div
            style={{
              fontSize: '72px',
              fontWeight: 800,
              color: '#1F2937',
              lineHeight: 1.1,
              marginBottom: '24px',
              maxWidth: '900px',
            }}
          >
            Fast & Secure URL Shortener
          </div>
          <div
            style={{
              fontSize: '32px',
              color: '#6B7280',
              lineHeight: 1.4,
              maxWidth: '800px',
            }}
          >
            Create custom short links with advanced analytics. Professional link management starting at $5/month.
          </div>
        </div>

        {/* Footer Badge */}
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '40px' }}>
          <div
            style={{
              background: '#1F2937',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '20px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            From app.orangeurl.live
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
