import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Docs() {
  return (
    <motion.div 
      className="dashboard-fullscreen"
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/dashboard" className="btn btn-secondary" style={{ width: 'auto', display: 'inline-flex', padding: '0.5rem 1rem', textDecoration: 'none', fontSize: '0.9rem' }}>
          &larr; Back to Dashboard
        </Link>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        <h1 className="title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Developer Documentation</h1>
        <p className="subtitle" style={{ fontSize: '1.2rem', marginBottom: '3rem' }}>Everything you need to integrate your application with Shomei OIDC.</p>

        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '2.5rem', borderRadius: '16px', border: '1px solid rgba(132, 204, 22, 0.1)', marginBottom: '3rem' }}>
          <h2 style={{ color: 'var(--text-accent)', fontSize: '1.8rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(132, 204, 22, 0.2)', paddingBottom: '0.5rem' }}>1. Standard Authorization Code Flow</h2>
          <p style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
            Use this flow if you are building a server-side application (like Node.js, Django, or Spring Boot) that can securely store a <code>client_secret</code>.
          </p>

          <h3 style={{ color: 'var(--text-secondary)', fontSize: '1.3rem', marginBottom: '1rem' }}>Step 1: Redirect the User</h3>
          <p style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Redirect the user's browser to the OIDC Frontend for them to log in and grant consent.</p>
          <pre style={{ background: '#0a0a0a', padding: '1.5rem', borderRadius: '8px', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem', color: '#e5e5e5' }}>
            <code>{`<a href="http://localhost:3000/authorize/YOUR_CLIENT_ID">Login with Shomei</a>`}</code>
          </pre>

          <h3 style={{ color: 'var(--text-secondary)', fontSize: '1.3rem', marginBottom: '1rem' }}>Step 2: Handle the Callback</h3>
          <p style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>The user will be redirected back to your `redirect_uri` with a `shortcode` in the URL parameters. Exchange it for tokens.</p>
          <pre style={{ background: '#0a0a0a', padding: '1.5rem', borderRadius: '8px', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.1)', color: '#e5e5e5' }}>
            <code>{`app.get("/callback", async (req, res) => {
  const shortcode = req.query.shortcode;

  // Exchange shortcode for tokens
  const tokenResponse = await axios.post("http://localhost:3371/token-exchange", {
    shortcode,
    clientId: "YOUR_CLIENT_ID",
    clientSecret: "YOUR_CLIENT_SECRET"
  });

  const accessToken = tokenResponse.data.access_token;

  // Fetch user profile
  const userResponse = await axios.get("http://localhost:3371/userinfo", {
    headers: { Authorization: \`Bearer \${accessToken}\` }
  });

  console.log(userResponse.data);
});`}</code>
          </pre>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '2.5rem', borderRadius: '16px', border: '1px solid rgba(132, 204, 22, 0.1)', marginBottom: '3rem' }}>
          <h2 style={{ color: 'var(--text-accent)', fontSize: '1.8rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(132, 204, 22, 0.2)', paddingBottom: '0.5rem' }}>2. PKCE Authorization Code Flow</h2>
          <p style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
            If you are building a SPA (React, Vue, Angular) or a Mobile App where you <strong>cannot securely store a client secret</strong>, you MUST use PKCE (Proof Key for Code Exchange).
          </p>

          <h3 style={{ color: 'var(--text-secondary)', fontSize: '1.3rem', marginBottom: '1rem' }}>Step 1: Generate PKCE Challenge</h3>
          <p style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Generate a secure random string (code verifier) and hash it using SHA-256 (code challenge).</p>
          <pre style={{ background: '#0a0a0a', padding: '1.5rem', borderRadius: '8px', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem', color: '#e5e5e5' }}>
            <code>{`async function generatePKCE() {
  const array = new Uint32Array(28);
  window.crypto.getRandomValues(array);
  const codeVerifier = Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');

  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const hash = await window.crypto.subtle.digest('SHA-256', data);
  const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, '');

  localStorage.setItem("pkce_verifier", codeVerifier); 
  return codeChallenge;
}`}</code>
          </pre>

          <h3 style={{ color: 'var(--text-secondary)', fontSize: '1.3rem', marginBottom: '1rem' }}>Step 2: Redirect with Challenge</h3>
          <p style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Include the challenge in your authorization URL.</p>
          <pre style={{ background: '#0a0a0a', padding: '1.5rem', borderRadius: '8px', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem', color: '#e5e5e5' }}>
            <code>{`const challenge = await generatePKCE();
const authUrl = \`http://localhost:3000/authorize/YOUR_CLIENT_ID?code_challenge=\${challenge}&code_challenge_method=S256\`;
window.location.href = authUrl;`}</code>
          </pre>

          <h3 style={{ color: 'var(--text-secondary)', fontSize: '1.3rem', marginBottom: '1rem' }}>Step 3: Exchange Shortcode with Verifier</h3>
          <p style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>When the user returns, exchange the shortcode using the original <code>code_verifier</code> instead of a client secret.</p>
          <pre style={{ background: '#0a0a0a', padding: '1.5rem', borderRadius: '8px', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.1)', color: '#e5e5e5' }}>
            <code>{`const urlParams = new URLSearchParams(window.location.search);
const shortcode = urlParams.get('shortcode');
const codeVerifier = localStorage.getItem("pkce_verifier");

const response = await fetch("http://localhost:3371/token-exchange", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    shortcode: shortcode,
    clientId: "YOUR_CLIENT_ID",
    code_verifier: codeVerifier
  })
});

const tokens = await response.json();`}</code>
          </pre>
        </div>
      </div>
    </motion.div>
  );
}
