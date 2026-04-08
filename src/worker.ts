export interface Env {
  WISHES: KVNamespace;
}

interface Wish {
  id: string;
  description: string;
  timestamp: number;
  status: 'pending' | 'processing' | 'fulfilled' | 'failed';
  vessels: string[];
  refinement?: string;
}

interface Vessel {
  id: string;
  name: string;
  capabilities: string[];
  status: 'available' | 'busy' | 'maintenance';
}

const VESSELS: Vessel[] = [
  { id: 'v1', name: 'Aether Runner', capabilities: ['transport', 'scout', 'light-cargo'], status: 'available' },
  { id: 'v2', name: 'Forge Hammer', capabilities: ['construction', 'mining', 'heavy-lift'], status: 'available' },
  { id: 'v3', name: 'Silent Watcher', capabilities: ['surveillance', 'comms', 'data-analysis'], status: 'available' },
  { id: 'v4', name: 'Void Weaver', capabilities: ['research', 'sampling', 'science'], status: 'maintenance' },
  { id: 'v5', name: 'Star Herald', capabilities: ['diplomacy', 'communication', 'translation'], status: 'available' }
];

const HTML_HEADER = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fleet Djinn</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', sans-serif;
      background: #0a0a0f;
      color: #f8fafc;
      line-height: 1.6;
      min-height: 100vh;
      padding: 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    header {
      text-align: center;
      padding: 3rem 1rem;
      border-bottom: 1px solid #1e293b;
      margin-bottom: 3rem;
    }
    h1 {
      font-size: 3.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 1rem;
    }
    .tagline {
      font-size: 1.2rem;
      color: #94a3b8;
      max-width: 600px;
      margin: 0 auto;
    }
    .main-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      margin-bottom: 4rem;
    }
    @media (max-width: 768px) {
      .main-content { grid-template-columns: 1fr; }
    }
    .card {
      background: #111827;
      border-radius: 12px;
      padding: 2rem;
      border: 1px solid #1e293b;
    }
    .card h2 {
      color: #d946ef;
      margin-bottom: 1.5rem;
      font-size: 1.8rem;
    }
    textarea {
      width: 100%;
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 8px;
      color: #f8fafc;
      padding: 1rem;
      font-family: 'Inter', sans-serif;
      font-size: 1rem;
      resize: vertical;
      min-height: 120px;
      margin-bottom: 1rem;
    }
    textarea:focus {
      outline: none;
      border-color: #d946ef;
    }
    .btn {
      background: linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%);
      color: white;
      border: none;
      padding: 0.8rem 1.8rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .btn:hover {
      transform: translateY(-2px);
    }
    .wish-list {
      list-style: none;
    }
    .wish-item {
      background: #0f172a;
      border-left: 4px solid #d946ef;
      padding: 1.2rem;
      margin-bottom: 1rem;
      border-radius: 0 8px 8px 0;
    }
    .wish-desc {
      margin-bottom: 0.5rem;
    }
    .wish-meta {
      font-size: 0.9rem;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
    }
    .vessel-tag {
      display: inline-block;
      background: #1e1b4b;
      color: #a5b4fc;
      padding: 0.3rem 0.7rem;
      border-radius: 20px;
      font-size: 0.85rem;
      margin-right: 0.5rem;
      margin-top: 0.5rem;
    }
    footer {
      text-align: center;
      padding: 2rem;
      border-top: 1px solid #1e293b;
      color: #64748b;
      font-size: 0.9rem;
    }
    .health {
      color: #10b981;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Fleet Djinn</h1>
      <p class="tagline">Wish-based fleet interaction. Describe what you want, the fleet builds it.</p>
    </header>`;

const HTML_FOOTER = `    <footer>
      <p>Fleet Djinn &copy; ${new Date().getFullYear()} | Wish responsibly</p>
      <p>Fleet status: <span class="health">All systems operational</span></p>
    </footer>
  </div>
  <script>
    async function submitWish() {
      const textarea = document.getElementById('wishInput');
      const desc = textarea.value.trim();
      if (!desc) return;
      
      const btn = document.querySelector('.btn');
      btn.disabled = true;
      btn.textContent = 'Wish processing...';
      
      try {
        const res = await fetch('/api/wish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ description: desc })
        });
        const data = await res.json();
        if (data.success) {
          textarea.value = '';
          location.reload();
        } else {
          alert('Wish failed: ' + (data.error || 'Unknown error'));
        }
      } catch (err) {
        alert('Network error');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Make Wish';
      }
    }
    
    document.addEventListener('DOMContentLoaded', function() {
      const textarea = document.getElementById('wishInput');
      textarea.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
          submitWish();
        }
      });
    });
  </script>
</body>
</html>`;

function selectVessels(description: string): string[] {
  const desc = description.toLowerCase();
  const selected: string[] = [];
  
  for (const vessel of VESSELS) {
    if (vessel.status !== 'available') continue;
    
    for (const capability of vessel.capabilities) {
      if (desc.includes(capability) || 
          (capability === 'transport' && (desc.includes('deliver') || desc.includes('move'))) ||
          (capability === 'scout' && desc.includes('explore')) ||
          (capability === 'construction' && (desc.includes('build') || desc.includes('construct')))) {
        if (!selected.includes(vessel.id)) {
          selected.push(vessel.id);
        }
      }
    }
  }
  
  if (selected.length === 0) {
    return [VESSELS.find(v => v.status === 'available')?.id || 'v1'];
  }
  
  return selected.slice(0, 3);
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    
    if (request.method === 'GET' && path === '/health') {
      return new Response(JSON.stringify({ status: 'ok', timestamp: Date.now() }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (request.method === 'GET' && path === '/') {
      const wishes = await env.WISHES.list();
      const wishItems = await Promise.all(
        wishes.keys.map(async (key) => {
          const wish = await env.WISHES.get(key.name, 'json') as Wish;
          return wish;
        })
      );
      
      wishItems.sort((a, b) => b.timestamp - a.timestamp);
      
      let wishHistoryHtml = '';
      for (const wish of wishItems.slice(0, 10)) {
        const date = new Date(wish.timestamp).toLocaleString();
        const vesselsHtml = wish.vessels.map(id => {
          const vessel = VESSELS.find(v => v.id === id);
          return `<span class="vessel-tag">${vessel?.name || id}</span>`;
        }).join('');
        
        wishHistoryHtml += `
          <li class="wish-item">
            <div class="wish-desc">${wish.description}</div>
            <div class="wish-meta">
              <span>${date}</span>
              <span>Status: ${wish.status}</span>
            </div>
            ${vesselsHtml}
          </li>`;
      }
      
      const html = `${HTML_HEADER}
        <div class="main-content">
          <div class="card">
            <h2>Make a Wish</h2>
            <textarea id="wishInput" placeholder="Describe your wish in natural language...&#10;Example: &quot;Survey the asteroid field and collect mineral samples&quot;&#10;&#10;Press Ctrl+Enter to submit"></textarea>
            <button class="btn" onclick="submitWish()">Make Wish</button>
          </div>
          <div class="card">
            <h2>Recent Wishes</h2>
            <ul class="wish-list">
              ${wishHistoryHtml || '<li class="wish-item">No wishes yet. Make the first one!</li>'}
            </ul>
          </div>
        </div>
        ${HTML_FOOTER}`;
      
      return new Response(html, {
        headers: {
          'Content-Type': 'text/html;charset=UTF-8',
          'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com;",
          'X-Frame-Options': 'DENY'
        }
      });
    }
    
    if (request.method === 'POST' && path === '/api/wish') {
      try {
        const body = await request.json() as { description: string; refinement?: string };
        if (!body.description?.trim()) {
          return new Response(JSON.stringify({ success: false, error: 'Description required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const wishId = Date.now().toString(36) + Math.random().toString(36).substr(2);
        const vessels = selectVessels(body.description);
        
        const wish: Wish = {
          id: wishId,
          description: body.description.trim(),
          timestamp: Date.now(),
          status: 'pending',
          vessels: vessels,
          refinement: body.refinement
        };
        
        await env.WISHES.put(wishId, JSON.stringify(wish));
        
        return new Response(JSON.stringify({
          success: true,
          wishId,
          vessels: vessels.map(id => VESSELS.find(v => v.id === id)?.name),
          message: 'Wish received. Fleet Djinn is processing your request.'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ success: false, error: 'Invalid request' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    if (request.method === 'GET' && path === '/api/history') {
      const wishes = await env.WISHES.list();
      const wishList = await Promise.all(
        wishes.keys.map(async (key) => {
          return await env.WISHES.get(key.name, 'json') as Wish;
        })
      );
      
      wishList.sort((a, b) => b.timestamp - a.timestamp);
      
      return new Response(JSON.stringify({
        wishes: wishList,
        count: wishList.length,
        fleetStatus: VESSELS.map(v => ({ id: v.id, name: v.name, status: v.status }))
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (request.method === 'GET' && path === '/api/wishes') {
      const params = url.searchParams;
      const vesselId = params.get('vessel');
      
      const wishes = await env.WISHES.list();
      const allWishes = await Promise.all(
        wishes.keys.map(async (key) => {
          return await env.WISHES.get(key.name, 'json') as Wish;
        })
      );
      
      let filteredWishes = allWishes;
      if (vesselId) {
        filteredWishes = allWishes.filter(wish => wish.vessels.includes(vesselId));
      }
      
      filteredWishes.sort((a, b) => b.timestamp - a.timestamp);
      
      return new Response(JSON.stringify({
        wishes: filteredWishes,
        count: filteredWishes.length,
        vessel: vesselId ? VESSELS.find(v => v.id === vesselId) : null
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
