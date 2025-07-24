import React from 'react';

export const metadata = {
  title: 'About Us - Lokotsav',
  description: 'A short and sweet about page for the Lokotsav event platform.',
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 text-deepNavy">
      <h1 className="text-4xl font-bold mb-6 text-center">👋 About Lokotsav</h1>

      <p className="text-lg mb-4">
        Lokotsav is your friendly event finding platform for Gujarat — built to connect, explore, and manage events
        without stress.
      </p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">🚀 What makes us different?</h2>
        <ul className="list-disc list-inside space-y-1 ">
          <li>The application is scalable</li>
          <li>Secure: AES-256 + JWT powered authentication</li>
          <li>Event listings with real-time search & city filters</li>
          <li>You can get your events featured</li>
          <li>Bookmark tickets & Buy Tickets with a dummy payment gateway</li>
          <li>Used Shadcn components for better reusebility & responsive UI</li>
          <li>SEO-friendly and fast ⚡</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">🛠️ Tech Stack</h2>
        <p >
          Next.js · React.js · Tailwind CSS · Node.js · Express.js · MySQL · Postman · GitHub
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">📬 Contact</h2>
        <p >
          Built by Vishesh Shah.<br />
          Email: <a href="mailto:visheshshah.414@gmail.com" className="text-blue-600 underline">visheshshah.414@gmail.com</a><br />
          GitHub: <a href="https://github.com/Vishesh0001" target="_blank" className="text-blue-600 underline">Vishesh0001</a>
        </p>
      </section>
    </main>
  );
}
