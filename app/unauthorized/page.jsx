import Link from "next/link";

// pages/unauthorized.js
export default function Unauthorized() {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Unauthorized</h1>
        <p>No session found. Please <Link href="/">log in</Link> to continue.</p>
      </div>
    );
  }
  