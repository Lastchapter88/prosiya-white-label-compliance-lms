# ProSiya AI Assistant

## Overview

The website chat widget talks to a **Cloudflare Worker**. The Worker calls Qwen
(DashScope OpenAI-compatible API) with a **server-side** API key.

```
Visitor → ChatWidget → POST https://prosiya-chat.tilesmirrored.workers.dev
  → ConversationService → Knowledge + Qwen → Qwen API
```

The visitor never sees Qwen, DashScope, or Alibaba branding.

No Firebase Blaze plan is required for chat.

## Architecture

| Layer | Location |
|-------|----------|
| Chat UI | `frontend/src/lib/components/ChatWidget.svelte` |
| Chat API client | `frontend/src/lib/services/chat.ts` |
| API URL config | `frontend/src/lib/config/chat.ts` |
| Cloudflare Worker | `cloudflare/chat-worker/` |
| Knowledge | `functions/knowledge/prosiya.md` (source) → synced into Worker `src/knowledgeContent.ts` |
| Legacy Python (optional / tests) | `functions/chat/*`, `functions/ai/*` |

## Environment / secrets (Cloudflare)

Never put the Qwen key in the frontend.

```bash
cd cloudflare/chat-worker
npx wrangler secret put QWEN_API_KEY
npx wrangler deploy
```

Optional vars in `wrangler.toml`:

- `QWEN_MODEL` (default `qwen-plus`)
- `QWEN_API_BASE_URL` (DashScope international OpenAI-compatible URL)

Local: copy `.dev.vars.example` → `.dev.vars` and run `npm run dev`.

## Frontend

Default Worker URL is set in `chatConfig.apiUrl`. Override with:

```
VITE_CHAT_API_URL=https://prosiya-chat.tilesmirrored.workers.dev
```

After frontend changes:

```bash
cd frontend && npm run build && cd .. && firebase deploy --only hosting
```

## Update ProSiya knowledge

1. Edit `functions/knowledge/prosiya.md`
2. Re-sync into the Worker:

```bash
cd cloudflare/chat-worker
node -e "const fs=require('fs'); const md=fs.readFileSync('../../functions/knowledge/prosiya.md','utf8'); fs.writeFileSync('src/knowledgeContent.ts', '/** Auto-synced from functions/knowledge/prosiya.md */\\nexport const KNOWLEDGE_MARKDOWN = ' + JSON.stringify(md) + ';\\n');"
npx wrangler deploy
```

Rules:

- Only add verified public information.
- Do not invent prices, branches, guarantees, or contact details.

## Safety checklist

- [ ] `QWEN_API_KEY` is only in Cloudflare secrets / `.dev.vars` / gitignored `.env`
- [ ] Frontend bundle has no `sk-` / Qwen key
- [ ] Chat answers from live site without mentioning Qwen/Alibaba
