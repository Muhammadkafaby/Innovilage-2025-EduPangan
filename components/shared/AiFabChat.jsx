'use client';

import React, { useMemo, useState } from 'react';
import Icon from './Icon';

const defaultQuickPrompts = {
  user: [
    'Buatkan menu sehat hari ini dari hasil kebun saya.',
    'Tips gizi anak sekolah yang praktis dan murah.',
    'Cara olah sayur agar gizinya tidak banyak hilang?',
  ],
  admin: [
    'Ringkas 3 ide program gizi mingguan untuk warga.',
    'Buat checklist evaluasi bank bibit bulan ini.',
    'Rekomendasikan topik artikel gizi 7 hari ke depan.',
  ],
};

function formatMessageForDisplay(text) {
  const raw = String(text || '');

  if (/cannot read\s+"?.+\.(png|jpg|jpeg|webp|gif)"?.*does not support image input/i.test(raw)) {
    return 'Saat ini AI chat hanya mendukung input teks. Saya belum bisa membaca file gambar (mis. PNG/JPG). Tolong tulis isi gambar atau pertanyaannya dalam teks, nanti saya bantu jawab.';
  }

  const cleaned = raw
    .replace(/<system-reminder>[\s\S]*?<\/system-reminder>/gi, '')
    .replace(/&lt;system-reminder&gt;[\s\S]*?&lt;\/system-reminder&gt;/gi, '')
    .replace(/<system-reminder>[\s\S]*/gi, '')
    .replace(/&lt;system-reminder&gt;[\s\S]*/gi, '')
    .replace(/your operational mode has changed[\s\S]*/gi, '')
    .replace(/^ERROR:\s*/gim, '')
    .replace(/inform the user\.?/gi, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return cleaned
    .replace(/\\\(\\displaystyle\s*([\s\S]*?)\\\)/g, '$1')
    .replace(/\\\(([\s\S]*?)\\\)/g, '$1')
    .replace(/\\\[([\s\S]*?)\\\]/g, '$1')
    .replace(/\\langle\s*/g, '<')
    .replace(/\\rangle/g, '>')
    .replace(/\\vec\{([^}]+)\}/g, '$1')
    .replace(/\\mathbf\{([^}]+)\}/g, '$1')
    .replace(/\\cdot/g, '·')
    .replace(/\\times/g, '×')
    .replace(/\\bigl/g, '')
    .replace(/\\bigr/g, '')
    .replace(/\\left/g, '')
    .replace(/\\right/g, '')
    .replace(/\\;/g, ' ')
    .replace(/\\,/g, ' ')
    .replace(/\\ /g, ' ')
    .replace(/\\_/g, '_')
    .replace(/\*\*\s*\\\s*/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function cleanUserInput(text) {
  return String(text || '')
    .replace(/<system-reminder>[\s\S]*?<\/system-reminder>/gi, '')
    .replace(/your operational mode has changed[\s\S]*/gi, '')
    .trim();
}

function renderInlineText(text) {
  const parts = String(text || '')
    .split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*\n]+\*|_[^_\n]+_)/g)
    .filter(Boolean);

  return parts.map((part, idx) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={`i-${idx}`} className="px-1 py-0.5 rounded bg-black/10 text-[11px] font-mono">
          {part.slice(1, -1)}
        </code>
      );
    }

    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={`i-${idx}`} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) {
      return (
        <em key={`i-${idx}`} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }

    return <React.Fragment key={`i-${idx}`}>{part}</React.Fragment>;
  });
}

function renderFormattedText(text) {
  const cleaned = formatMessageForDisplay(text);
  if (!cleaned) return null;

  if (/\t/.test(cleaned)) {
    return renderDelimitedTable(cleaned, '\t');
  }

  if (/^\|.+\|$/m.test(cleaned)) {
    return renderTableText(cleaned);
  }

  const lines = cleaned.split('\n');
  const blocks = [];
  let paragraph = [];
  let listItems = [];
  let codeLines = [];
  let inCode = false;

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push({ type: 'paragraph', text: paragraph.join(' ') });
      paragraph = [];
    }
  };

  const flushList = () => {
    if (listItems.length > 0) {
      blocks.push({ type: 'list', items: listItems });
      listItems = [];
    }
  };

  const flushCode = () => {
    if (codeLines.length > 0) {
      blocks.push({ type: 'code', text: codeLines.join('\n') });
      codeLines = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      flushParagraph();
      flushList();
      if (inCode) {
        flushCode();
        inCode = false;
      } else {
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    if (/^#{1,3}\s+/.test(trimmed)) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'heading', text: trimmed.replace(/^#{1,3}\s+/, '') });
      continue;
    }

    if (/^([-*]|\d+\.)\s+/.test(trimmed)) {
      flushParagraph();
      listItems.push(trimmed.replace(/^([-*]|\d+\.)\s+/, ''));
      continue;
    }

    flushList();
    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();
  flushCode();

  return blocks.map((block, idx) => {
    if (block.type === 'heading') {
      return (
        <h4 key={`b-${idx}`} className="font-semibold text-[13px] text-gray-800 mt-1 mb-1">
          {renderInlineText(block.text)}
        </h4>
      );
    }

    if (block.type === 'list') {
      return (
        <ul key={`b-${idx}`} className="list-disc pl-4 space-y-1">
          {block.items.map((item, lineIdx) => (
            <li key={`l-${lineIdx}`}>{renderInlineText(item)}</li>
          ))}
        </ul>
      );
    }

    if (block.type === 'code') {
      return (
        <pre key={`b-${idx}`} className="rounded-lg bg-black/75 text-green-100 p-2 overflow-x-auto text-[11px] font-mono leading-relaxed">
          <code>{block.text}</code>
        </pre>
      );
    }

    return (
      <p key={`b-${idx}`} className="whitespace-pre-wrap leading-relaxed">
        {renderInlineText(block.text)}
      </p>
    );
  });
}

function renderDelimitedTable(text, delimiter = '\t') {
  const rows = String(text)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(delimiter).map((cell) => cell.trim()));

  if (rows.length < 2) {
    return <p className="whitespace-pre-wrap leading-relaxed">{renderInlineText(text)}</p>;
  }

  const columnCount = Math.max(...rows.map((r) => r.length));
  const consistentRows = rows.filter((r) => r.length >= Math.max(2, columnCount - 1));

  if (consistentRows.length < 2) {
    return <p className="whitespace-pre-wrap leading-relaxed">{renderInlineText(text)}</p>;
  }

  const [firstRow, ...restRows] = consistentRows;
  const hasHeaderLike = firstRow.every((cell) => cell.length > 0) && restRows.length > 0;

  const header = hasHeaderLike ? firstRow : Array.from({ length: columnCount }, (_, i) => `Kolom ${i + 1}`);
  const body = hasHeaderLike ? restRows : consistentRows;

  return (
    <div className="overflow-x-auto rounded-lg border border-white/35 bg-white/20">
      <table className="min-w-full text-[11px] text-left align-top">
        <thead className="bg-white/40">
          <tr>
            {header.map((cell, idx) => (
              <th key={`dh-${idx}`} className="px-2 py-1.5 font-semibold text-gray-800 border-b border-white/35">
                {renderInlineText(cell)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, rowIdx) => (
            <tr key={`dr-${rowIdx}`} className="border-t border-white/20">
              {header.map((_, colIdx) => (
                <td key={`dc-${rowIdx}-${colIdx}`} className="px-2 py-1.5 align-top text-gray-700 whitespace-pre-wrap">
                  {renderInlineText(row[colIdx] || '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderTableText(text) {
  const lines = String(text)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const tableLines = lines.filter((line) => /^\|.*\|$/.test(line));
  if (tableLines.length < 2) {
    return <p className="whitespace-pre-wrap leading-relaxed">{renderInlineText(text)}</p>;
  }

  const rows = tableLines
    .map((line) => line.replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim()))
    .filter((cells) => cells.some(Boolean));

  const filteredRows = rows.filter((cells) => !cells.every((cell) => /^:?-{3,}:?$/.test(cell)));
  if (filteredRows.length === 0) {
    return <p className="whitespace-pre-wrap leading-relaxed">{renderInlineText(text)}</p>;
  }

  const [header, ...body] = filteredRows;

  return (
    <div className="overflow-x-auto rounded-lg border border-white/35 bg-white/20">
      <table className="min-w-full text-[11px] text-left">
        <thead className="bg-white/40">
          <tr>
            {header.map((cell, idx) => (
              <th key={`h-${idx}`} className="px-2 py-1.5 font-semibold text-gray-800 border-b border-white/35">
                {renderInlineText(cell)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, rowIdx) => (
            <tr key={`r-${rowIdx}`} className="border-t border-white/20">
              {header.map((_, colIdx) => (
                <td key={`c-${rowIdx}-${colIdx}`} className="px-2 py-1.5 align-top text-gray-700">
                  {renderInlineText(row[colIdx] || '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AiFabChat({ mode = 'user', userName, bottomOffsetClass = 'bottom-24' }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [adminActionLoading, setAdminActionLoading] = useState(false);
  const [showJobLogs, setShowJobLogs] = useState(false);
  const [jobLogs, setJobLogs] = useState([]);

  const title = mode === 'admin' ? 'AI Admin EduPangan' : 'AI Asisten Gizi';
  const quickPrompts = useMemo(() => defaultQuickPrompts[mode] || defaultQuickPrompts.user, [mode]);

  const runGenerateNow = async () => {
    if (mode !== 'admin' || adminActionLoading) return;

    setAdminActionLoading(true);
    setError('');
    try {
      const response = await fetch('/api/ai/generate-article', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal generate artikel AI');
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `✅ Artikel AI baru berhasil dibuat:\n**${data.article?.title || '-'}**\nTopik: ${data.topic || '-'}\nDurasi proses: ${data.durationMs || '-'} ms`,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `⚠️ Generate artikel gagal: ${err.message || 'Terjadi kesalahan'}` },
      ]);
    } finally {
      setAdminActionLoading(false);
    }
  };

  const loadJobLogs = async () => {
    if (mode !== 'admin' || adminActionLoading) return;

    setAdminActionLoading(true);
    setError('');
    try {
      const response = await fetch('/api/ai/jobs?limit=8', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal memuat AI job log');
      }

      setJobLogs(Array.isArray(data) ? data : []);
      setShowJobLogs(true);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `⚠️ Gagal memuat job log: ${err.message || 'Terjadi kesalahan'}` },
      ]);
    } finally {
      setAdminActionLoading(false);
    }
  };

  const sendMessage = async (text) => {
    const trimmed = cleanUserInput(text);
    if (!trimmed || isSending) return;

    const nextMessages = [...messages, { role: 'user', content: trimmed }];
    setMessages(nextMessages);
    setInput('');
    setIsSending(true);
    setError('');

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          mode,
          message: trimmed,
          history: nextMessages.slice(-8),
        }),
      });

      const data = await response.json();
      const replyText = formatMessageForDisplay(data?.reply || data?.error || 'Maaf, AI sedang sibuk. Coba lagi sebentar.');
      setMessages((prev) => [...prev, { role: 'assistant', content: replyText }]);
      setError('');
    } catch (err) {
      setError('');
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Maaf, AI sedang sibuk sebentar. Coba kirim ulang pertanyaan dalam 5-10 detik.' }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={`fixed ${bottomOffsetClass} right-4 z-40`}>
      {open && (
        <div className="w-[min(92vw,360px)] neo-card border border-white/45 mb-3 overflow-hidden">
          <div className="px-4 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white flex items-center justify-between">
            <div>
              <p className="text-sm font-bold">{title}</p>
              <p className="text-[11px] opacity-90">{userName ? `Halo, ${userName}` : 'Siap membantu Anda'}</p>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 rounded-lg bg-white/20">
              <Icon name="xmark" size={16} color="white" />
            </button>
          </div>

          <div className="px-3 py-3 max-h-72 overflow-y-auto space-y-2 bg-white/30">
            {mode === 'admin' && (
              <div className="neo-inset rounded-xl p-2 border border-white/40">
                <div className="flex gap-2">
                  <button
                    onClick={runGenerateNow}
                    disabled={adminActionLoading}
                    className="neo-button flex-1 text-[11px] px-2 py-2 text-green-700 border border-white/35 disabled:opacity-60"
                  >
                    <Icon name="sparkles" size={12} color="#15803D" className="mr-1" />
                    Generate Sekarang
                  </button>
                  <button
                    onClick={loadJobLogs}
                    disabled={adminActionLoading}
                    className="neo-button flex-1 text-[11px] px-2 py-2 text-blue-700 border border-white/35 disabled:opacity-60"
                  >
                    <Icon name="list" size={12} color="#1D4ED8" className="mr-1" />
                    Lihat Job Log
                  </button>
                </div>

                {showJobLogs && (
                  <div className="mt-2 max-h-28 overflow-y-auto space-y-1 text-[11px] text-gray-700">
                    {jobLogs.length === 0 ? (
                      <p className="text-gray-500">Belum ada log AI.</p>
                    ) : (
                      jobLogs.map((log) => (
                        <div key={log.id} className="rounded-lg px-2 py-1 bg-white/50 border border-white/30">
                          <p className="font-semibold">
                            {log.status === 'success' ? '✅' : '❌'} {log.title || log.topic || 'AI Job'}
                          </p>
                          <p className="text-gray-500">{new Date(log.createdAt).toLocaleString('id-ID')}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {messages.length === 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-600">Coba pertanyaan cepat:</p>
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      className="neo-button text-xs px-3 py-2 text-gray-700 border border-white/40 text-left"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, idx) => (
              <div key={`${m.role}-${idx}`} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-green-500 text-white'
                      : 'neo-inset text-gray-700 border border-white/35'
                  }`}
                >
                  {m.role === 'assistant' ? renderFormattedText(m.content) : m.content}
                </div>
              </div>
            ))}

            {isSending && (
              <div className="text-xs text-gray-500 flex items-center gap-2">
                <Icon name="refresh" size={12} className="animate-spin" /> AI sedang menulis...
              </div>
            )}
            {error && <p className="text-[11px] text-red-600">{error}</p>}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="p-3 border-t border-white/40 bg-white/20"
          >
            <div className="neo-inset rounded-xl px-3 py-2 flex items-center gap-2 border border-white/40">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tanya AI EduPangan..."
                className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                className="neo-button w-8 h-8 flex items-center justify-center disabled:opacity-50"
              >
                <Icon name="send" size={14} color="#16A34A" />
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-green-600 to-green-500 shadow-green text-white flex items-center justify-center"
        aria-label="Buka AI chat"
      >
        <Icon name="chat" size={24} color="white" />
      </button>
    </div>
  );
}
