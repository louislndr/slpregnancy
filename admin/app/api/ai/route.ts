import OpenAI from 'openai';
import type { ChatCompletionMessageParam, ChatCompletionTool } from 'openai/resources/chat';

export const runtime = 'nodejs';
export const maxDuration = 60;

const ALLOWED_PATHS = ['theme/colors.ts', 'theme/typography.ts', 'theme/spacing.ts'];
const REPO = 'louislndr/slpregnancy';
const BRANCH = process.env.GITHUB_CLIENT_BRANCH ?? 'var1';
const GH_TOKEN = process.env.GITHUB_TOKEN ?? '';

const SYSTEM_PROMPT = `You are the SL Pregnancy Studio assistant — a design-only AI assistant.
You help the app owner make visual and aesthetic changes to the app's theme.
You can read and write theme files to change colors, typography, and spacing.

You CANNOT change app logic, navigation flows, database schemas, user flows, component structure, or any non-visual code.

Allowed files: theme/colors.ts, theme/typography.ts, theme/spacing.ts.

Workflow:
1. Read the relevant file first to understand the current state and get the SHA.
2. Make only the visual changes the user requested — nothing more.
3. Write the updated file with your changes.
4. Briefly explain what you changed in plain language.

Design rules for the SL Pregnancy app:
- Primary color: #699BA9 (teal)
- Accent: #FFC299 (peach/orange)
- Background: #F9F7FF (off-white lavender)
- Fonts: Raleway (headings/buttons), Montserrat (body/labels), Playfair Display (display accents)
- Border radii: sm=8, md=16, lg=24, full=9999 — never intermediate values
- No uppercase text transforms

Be concise, warm, and precise. Always confirm what you changed after making it.`;

const TOOLS: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'read_file',
      description: 'Read a design/theme file from the app repository.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            enum: ALLOWED_PATHS,
            description: 'The file path to read.',
          },
        },
        required: ['path'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'write_file',
      description: 'Write changes to a design/theme file. Always call read_file first to get the SHA.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            enum: ALLOWED_PATHS,
            description: 'The file path to write.',
          },
          content: {
            type: 'string',
            description: 'The complete new file content.',
          },
          sha: {
            type: 'string',
            description: 'The SHA from the most recent read_file call — required by GitHub.',
          },
        },
        required: ['path', 'content', 'sha'],
      },
    },
  },
];

async function ghReadFile(path: string): Promise<{ content: string; sha: string } | { error: string }> {
  if (!ALLOWED_PATHS.includes(path)) {
    return { error: `Path not allowed. Allowed paths: ${ALLOWED_PATHS.join(', ')}` };
  }
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`,
    { headers: { Authorization: `Bearer ${GH_TOKEN}`, Accept: 'application/vnd.github+json' } },
  );
  if (!res.ok) return { error: `GitHub error: ${res.status} ${res.statusText}` };
  const data = await res.json() as { content: string; sha: string };
  return {
    content: Buffer.from(data.content, 'base64').toString('utf-8'),
    sha: data.sha,
  };
}

async function ghWriteFile(path: string, content: string, sha: string): Promise<{ success: boolean; error?: string }> {
  if (!ALLOWED_PATHS.includes(path)) {
    return { success: false, error: 'Path not allowed.' };
  }
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GH_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `design: update ${path} via Studio`,
        content: Buffer.from(content).toString('base64'),
        sha,
        branch: BRANCH,
      }),
    },
  );
  if (!res.ok) {
    const err = await res.json() as { message?: string };
    return { success: false, error: err.message ?? res.statusText };
  }
  return { success: true };
}

export async function POST(req: Request) {
  const { messages } = await req.json() as { messages: ChatCompletionMessageParam[] };

  if (!GH_TOKEN) {
    return new Response(JSON.stringify({ error: 'GITHUB_TOKEN not configured' }), { status: 500 });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const enc = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      function send(obj: Record<string, unknown>) {
        controller.enqueue(enc.encode(`data: ${JSON.stringify(obj)}\n\n`));
      }

      try {
        const history: ChatCompletionMessageParam[] = [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ];

        // Agentic loop — repeats when there are tool calls to process
        for (let turn = 0; turn < 6; turn++) {
          const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            stream: true,
            messages: history,
            tools: TOOLS,
            tool_choice: 'auto',
          });

          let textBuffer = '';
          const toolCallAccum: Record<number, { id: string; name: string; args: string }> = {};
          let finishReason = '';

          for await (const chunk of completion) {
            const choice = chunk.choices[0];
            if (!choice) continue;
            finishReason = choice.finish_reason ?? finishReason;

            const delta = choice.delta;
            if (delta.content) {
              textBuffer += delta.content;
              send({ t: 'text', v: delta.content });
            }
            if (delta.tool_calls) {
              for (const tc of delta.tool_calls) {
                const i = tc.index;
                if (!toolCallAccum[i]) toolCallAccum[i] = { id: '', name: '', args: '' };
                if (tc.id) toolCallAccum[i].id += tc.id;
                if (tc.function?.name) toolCallAccum[i].name += tc.function.name;
                if (tc.function?.arguments) toolCallAccum[i].args += tc.function.arguments;
              }
            }
          }

          const toolCalls = Object.values(toolCallAccum);

          // Push assistant turn into history
          if (toolCalls.length > 0) {
            history.push({
              role: 'assistant',
              content: textBuffer || null,
              tool_calls: toolCalls.map((tc) => ({
                id: tc.id,
                type: 'function' as const,
                function: { name: tc.name, arguments: tc.args },
              })),
            });
          } else {
            history.push({ role: 'assistant', content: textBuffer });
          }

          if (toolCalls.length === 0 || finishReason === 'stop') break;

          // Execute each tool and stream status
          for (const tc of toolCalls) {
            let args: Record<string, string>;
            try {
              args = JSON.parse(tc.args);
            } catch {
              args = {};
            }

            send({ t: 'tool', n: tc.name, a: args });

            let result: unknown;
            if (tc.name === 'read_file') {
              result = await ghReadFile(args.path ?? '');
            } else if (tc.name === 'write_file') {
              result = await ghWriteFile(args.path ?? '', args.content ?? '', args.sha ?? '');
            } else {
              result = { error: 'Unknown tool' };
            }

            history.push({
              role: 'tool',
              tool_call_id: tc.id,
              content: JSON.stringify(result),
            });
          }
        }

        send({ t: 'done' });
      } catch (err) {
        send({ t: 'error', v: err instanceof Error ? err.message : 'Unknown error' });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
