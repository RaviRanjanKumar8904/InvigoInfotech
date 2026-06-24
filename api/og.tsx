import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Dynamic parameters
    const hasStudent = searchParams.has('name');
    const name = hasStudent ? searchParams.get('name')?.slice(0, 50) : 'Student';
    const domain = searchParams.get('domain') || 'Technical Training';
    const duration = searchParams.get('duration') || '4';
    
    // Background colors for domains
    const colors = {
      primary: '#0f172a',    // slate-900
      secondary: '#1e293b',  // slate-800
      accent: '#2563eb',     // blue-600
    };

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.primary,
            fontFamily: 'sans-serif',
            backgroundImage: 'radial-gradient(circle at 25px 25px, #334155 2%, transparent 0%), radial-gradient(circle at 75px 75px, #334155 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            color: 'white',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              padding: '60px',
              borderRadius: '30px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              width: '80%',
              height: '75%',
              position: 'relative',
              border: '4px solid #e2e8f0'
            }}
          >
            {/* Logo placeholder */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.accent, borderRadius: '15px', padding: '10px 20px' }}>
                 <span style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}>INVIGO</span>
               </div>
            </div>

            <div style={{ display: 'flex', color: '#64748b', fontSize: '24px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 'bold' }}>
              Certificate of Completion
            </div>

            <div style={{ display: 'flex', color: '#0f172a', fontSize: '72px', fontWeight: '900', textAlign: 'center', marginBottom: '20px', letterSpacing: '-2px' }}>
              {name}
            </div>

            <div style={{ display: 'flex', color: '#334155', fontSize: '36px', textAlign: 'center', fontWeight: 'bold', marginBottom: '10px' }}>
              {domain}
            </div>

            <div style={{ display: 'flex', color: '#64748b', fontSize: '24px', textAlign: 'center' }}>
              {duration} Weeks Virtual Internship Program
            </div>

            {/* Seal */}
            <div style={{ position: 'absolute', bottom: '40px', right: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '40px', backgroundColor: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontSize: '40px' }}>★</span>
              </div>
              <div style={{ color: '#94a3b8', fontSize: '16px', marginTop: '10px', fontWeight: 'bold' }}>VERIFIED</div>
            </div>

            <div style={{ position: 'absolute', bottom: '40px', left: '40px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
               <div style={{ color: '#0f172a', fontSize: '20px', fontWeight: 'bold', borderBottom: '2px solid #0f172a', paddingBottom: '5px' }}>
                 Ravi Ranjan Kumar
               </div>
               <div style={{ color: '#64748b', fontSize: '16px', marginTop: '5px' }}>
                 Director, Invigo Infotech
               </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
