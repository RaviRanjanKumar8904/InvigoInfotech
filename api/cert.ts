export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) {
    return new Response('Missing certificate ID', { status: 400 });
  }

  const projectId = process.env.VITE_FIREBASE_PROJECT_ID || 'invigo-infotech-c24dc';
  
  // Clean up ID logic just in case it doesn't match
  let searchId = id.toUpperCase();
  if (/^\d{2}IN/.test(searchId)) {
    searchId = `20${searchId}`;
  }

  const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/enrollments/${searchId}`;
  
  let name = 'Student';
  let domain = 'Technical Training';
  let duration = '4';

  try {
    const res = await fetch(firestoreUrl);
    if (res.ok) {
      const data = await res.json();
      if (data && data.fields) {
        name = data.fields.fullName?.stringValue || name;
        domain = data.fields.domainId?.stringValue || domain;
        duration = data.fields.durationWeeks?.integerValue || duration;
        
        const domainTitles: Record<string, string> = {
          'building_construction': 'Building Construction',
          'autocad': 'AutoCAD',
          'web_development': 'Web Development',
          'python_programming': 'Python Programming',
          'data_science': 'Data Science',
          'full_stack': 'Full Stack Development',
          'core_java': 'Core Java',
          'electric_vehicle': 'Electric Vehicle Design',
          'solidworks': 'Solidworks',
          'ic_engine': 'IC Engine Design',
        };
        domain = domainTitles[domain] || domain.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
      }
    } else {
      // It might have a suffix like -WEB_DEVELOPMENT. In the edge we can't easily query without a composite index, 
      // but we will do our best with just the base ID. The OG card doesn't need to be 100% perfect for old legacy IDs
      // because new certificates use the standard ID.
    }
  } catch (err) {
    console.error('Failed to fetch certificate:', err);
  }

  const ogImageUrl = `${url.origin}/api/og?name=${encodeURIComponent(name)}&domain=${encodeURIComponent(domain)}&duration=${encodeURIComponent(duration)}`;

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    
    <title>${name}'s Certificate | Invigo Infotech</title>
    <meta name="description" content="${name} successfully completed a ${duration}-week Virtual Internship Program in ${domain} at Invigo Infotech." />

    <!-- Open Graph / LinkedIn -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${url.href}" />
    <meta property="og:title" content="${name}'s Certificate | Invigo Infotech" />
    <meta property="og:description" content="${name} successfully completed a ${duration}-week Virtual Internship Program in ${domain} at Invigo Infotech." />
    <meta property="og:image" content="${ogImageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${name}'s Certificate | Invigo Infotech" />
    <meta name="twitter:description" content="${name} successfully completed a ${duration}-week Virtual Internship Program in ${domain} at Invigo Infotech." />
    <meta name="twitter:image" content="${ogImageUrl}" />

    <!-- Redirect to the frontend React app logic -->
    <script>
      window.location.href = "/?verify=" + encodeURIComponent("${id}");
    </script>
  </head>
  <body style="font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background: #f8fafc; color: #475569;">
    <p>Loading certificate verification...</p>
  </body>
</html>`;

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=UTF-8',
      'cache-control': 'public, max-age=3600',
    },
  });
}
