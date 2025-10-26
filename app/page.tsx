'use client'

import { useState } from 'react'

interface Email {
  from: string
  subject: string
  body: string
  date: string
}

export default function Home() {
  const [emails, setEmails] = useState<Email[]>([])
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [newEmail, setNewEmail] = useState<Email>({
    from: '',
    subject: '',
    body: '',
    date: new Date().toISOString().split('T')[0]
  })

  const handleAddEmail = () => {
    if (newEmail.from && newEmail.subject && newEmail.body) {
      setEmails([...emails, { ...newEmail }])
      setNewEmail({
        from: '',
        subject: '',
        body: '',
        date: new Date().toISOString().split('T')[0]
      })
      setShowForm(false)
    }
  }

  const handleSummarize = async () => {
    if (emails.length === 0) return

    setLoading(true)
    setSummary('')

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emails }),
      })

      const data = await response.json()
      setSummary(data.summary)
    } catch (error) {
      setSummary('Error generating summary. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const loadSampleEmails = () => {
    setEmails([
      {
        from: 'boss@company.com',
        subject: 'Q4 Project Deadline',
        body: 'Hi team, just a reminder that the Q4 project deadline is next Friday. Please make sure all deliverables are ready for review by Wednesday. Let me know if you have any concerns.',
        date: '2025-10-25'
      },
      {
        from: 'marketing@service.com',
        subject: '50% Off Sale - Limited Time!',
        body: 'Don\'t miss our biggest sale of the year! Get 50% off all premium plans. Use code SAVE50 at checkout. Offer expires in 48 hours!',
        date: '2025-10-24'
      },
      {
        from: 'support@banking.com',
        subject: 'Your Monthly Statement is Ready',
        body: 'Your monthly account statement for October 2025 is now available. Login to view your transactions and account balance. If you have questions, contact us at 1-800-BANK.',
        date: '2025-10-23'
      },
      {
        from: 'friend@email.com',
        subject: 'Lunch next week?',
        body: 'Hey! It\'s been too long. Want to grab lunch next week? I\'m free Tuesday or Thursday. Let me know what works for you!',
        date: '2025-10-26'
      }
    ])
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">📧 Email Summarizer Agent</h1>
          <p className="text-white text-lg opacity-90">AI-powered email summaries at your fingertips</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Email Input Section */}
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Your Emails ({emails.length})</h2>
              <div className="flex gap-2">
                {emails.length === 0 && (
                  <button
                    onClick={loadSampleEmails}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    Load Samples
                  </button>
                )}
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  + Add Email
                </button>
              </div>
            </div>

            {showForm && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <input
                  type="text"
                  placeholder="From"
                  value={newEmail.from}
                  onChange={(e) => setNewEmail({...newEmail, from: e.target.value})}
                  className="w-full mb-2 p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  placeholder="Subject"
                  value={newEmail.subject}
                  onChange={(e) => setNewEmail({...newEmail, subject: e.target.value})}
                  className="w-full mb-2 p-2 border border-gray-300 rounded"
                />
                <textarea
                  placeholder="Email body"
                  value={newEmail.body}
                  onChange={(e) => setNewEmail({...newEmail, body: e.target.value})}
                  className="w-full mb-2 p-2 border border-gray-300 rounded h-24"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddEmail}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {emails.length === 0 ? (
                <div className="text-center text-gray-400 py-12">
                  <p className="text-lg">No emails yet</p>
                  <p className="text-sm">Add emails or load samples to get started</p>
                </div>
              ) : (
                emails.map((email, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 transition">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold text-gray-800">{email.from}</div>
                      <button
                        onClick={() => setEmails(emails.filter((_, i) => i !== index))}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">{email.subject}</div>
                    <div className="text-xs text-gray-500 line-clamp-2">{email.body}</div>
                    <div className="text-xs text-gray-400 mt-2">{email.date}</div>
                  </div>
                ))
              )}
            </div>

            {emails.length > 0 && (
              <button
                onClick={handleSummarize}
                disabled={loading}
                className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? '🤖 Analyzing...' : '✨ Summarize Emails'}
              </button>
            )}
          </div>

          {/* Summary Section */}
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📝 AI Summary</h2>
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 min-h-[400px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
                  <p className="text-gray-600">Analyzing your emails...</p>
                </div>
              ) : summary ? (
                <div className="prose prose-sm max-w-none">
                  <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {summary}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-center">
                  <div>
                    <div className="text-6xl mb-4">🤖</div>
                    <p className="text-lg">Your AI summary will appear here</p>
                    <p className="text-sm mt-2">Add emails and click summarize to get started</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-white opacity-75 text-sm">
          <p>Powered by Claude AI • Secure & Private</p>
        </div>
      </div>
    </main>
  )
}
