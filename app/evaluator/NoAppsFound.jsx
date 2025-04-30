import React from 'react'

export default function NoAppsFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex flex-col items-center justify-center px-4 py-8">
      <section className="bg-white/5 backdrop-blur-md rounded-xl shadow-lg px-8 py-6 w-full max-w-xl text-white border border-white/10">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold mb-2 tracking-tight text-slate-100">
            No Applications Yet
          </h2>
          <p className="text-sm text-slate-400">
            There are currently no developer applications available.
          </p>
        </div>
        <p className="text-sm text-slate-400">
          Give it a little time — they'll start showing up soon. 🚀
        </p>
        <button
            className="my-8 px-4 py-2 bg-cyan-600 rounded-md hover:bg-cyan-700 transition"
          >
            Refresh
          </button>
      </section>
    </main>
  )
}
