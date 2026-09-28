import fs from 'fs/promises';
import path from 'path';
import clientPromise from './mongodb';

const getFilePath = () => path.join(process.cwd(), 'data', 'flowcharts.json');

// In-memory cache for live serverless instances
let memoryFlowchartsCache: Record<string, any> | null = null;

export async function getFlowchartsData(): Promise<Record<string, any>> {
  // 1. HIGHEST PRIORITY: Live MongoDB Database
  if (process.env.MONGODB_URI && clientPromise) {
    try {
      const client = await clientPromise;
      const dbName = process.env.MONGODB_DB || 'portfolio_db';
      const db = client.db(dbName);
      const doc = await db.collection('flowcharts').findOne({ _id: 'flowcharts_config' as any });
      
      if (doc && doc.data && typeof doc.data === 'object') {
        memoryFlowchartsCache = doc.data;
        return doc.data;
      }
    } catch (err) {
      console.warn('MongoDB read error, trying fallback providers:', err);
    }
  }

  // 2. Google Sheets Webhook
  const googleWebhook = process.env.GOOGLE_SHEET_WEBHOOK_URL || process.env.GOOGLE_SHEETS_URL;
  if (googleWebhook) {
    try {
      const res = await fetch(googleWebhook, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object') return data;
      }
    } catch (err) {
      console.warn('Google Sheets read failed:', err);
    }
  }

  // 3. Upstash Redis / Vercel KV
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (kvUrl && kvToken) {
    try {
      const res = await fetch(`${kvUrl}/get/flowchart_data`, {
        headers: { Authorization: `Bearer ${kvToken}` },
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        const rawResult = data.result;
        if (rawResult) {
          const parsed = typeof rawResult === 'string' ? JSON.parse(rawResult) : rawResult;
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Upstash/Vercel KV read failed:', err);
    }
  }

  // 4. JSONBin API
  const jsonBinId = process.env.JSONBIN_BIN_ID;
  const jsonBinKey = process.env.JSONBIN_API_KEY;
  if (jsonBinId && jsonBinKey) {
    try {
      const res = await fetch(`https://api.jsonbin.io/v3/b/${jsonBinId}/latest`, {
        headers: { 'X-Master-Key': jsonBinKey },
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.record) return data.record;
      }
    } catch (err) {
      console.warn('JSONBin read failed:', err);
    }
  }

  // 5. In-Memory Cache
  if (memoryFlowchartsCache) {
    return memoryFlowchartsCache;
  }

  // 6. Default Local file data/flowcharts.json
  try {
    const filePath = getFilePath();
    const content = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(content);
    memoryFlowchartsCache = parsed;
    return parsed;
  } catch (err) {
    console.error('Error reading local flowcharts.json:', err);
    return {};
  }
}

export async function saveFlowchartsData(updatedData: Record<string, any>): Promise<{ success: boolean; provider: string; error?: string }> {
  // Update in-memory cache
  memoryFlowchartsCache = updatedData;
  let savedSuccess = false;
  let activeProvider = 'memory';

  // 1. HIGHEST PRIORITY: Live MongoDB Database
  if (process.env.MONGODB_URI && clientPromise) {
    try {
      const client = await clientPromise;
      const dbName = process.env.MONGODB_DB || 'portfolio_db';
      const db = client.db(dbName);
      await db.collection('flowcharts').updateOne(
        { _id: 'flowcharts_config' as any },
        { $set: { data: updatedData, updatedAt: new Date() } },
        { upsert: true }
      );
      savedSuccess = true;
      activeProvider = 'Live MongoDB Database';
      return { success: true, provider: activeProvider };
    } catch (err) {
      console.warn('MongoDB save error:', err);
    }
  }

  // 2. Google Sheets Webhook
  const googleWebhook = process.env.GOOGLE_SHEET_WEBHOOK_URL || process.env.GOOGLE_SHEETS_URL;
  if (googleWebhook) {
    try {
      const res = await fetch(googleWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (res.ok) {
        savedSuccess = true;
        activeProvider = 'Google Sheets Webhook';
      }
    } catch (err) {
      console.warn('Google Sheets save failed:', err);
    }
  }

  // 3. Upstash Redis / Vercel KV
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (kvUrl && kvToken) {
    try {
      const res = await fetch(`${kvUrl}/set/flowchart_data`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${kvToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(JSON.stringify(updatedData)),
      });
      if (res.ok) {
        savedSuccess = true;
        activeProvider = 'Upstash Redis / Vercel KV';
      }
    } catch (err) {
      console.warn('Upstash/Vercel KV save failed:', err);
    }
  }

  // 4. JSONBin API
  const jsonBinId = process.env.JSONBIN_BIN_ID;
  const jsonBinKey = process.env.JSONBIN_API_KEY;
  if (jsonBinId && jsonBinKey) {
    try {
      const res = await fetch(`https://api.jsonbin.io/v3/b/${jsonBinId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': jsonBinKey,
        },
        body: JSON.stringify(updatedData),
      });
      if (res.ok) {
        savedSuccess = true;
        activeProvider = 'JSONBin';
      }
    } catch (err) {
      console.warn('JSONBin save failed:', err);
    }
  }

  // 5. GitHub API Commit
  const ghToken = process.env.GITHUB_TOKEN;
  const ghRepo = process.env.GITHUB_REPO || 'patelvandan11/flask12';
  if (ghToken && ghRepo) {
    try {
      const getFileRes = await fetch(`https://api.github.com/repos/${ghRepo}/contents/data/flowcharts.json`, {
        headers: { Authorization: `token ${ghToken}`, Accept: 'application/vnd.github.v3+json' },
      });
      let sha = '';
      if (getFileRes.ok) {
        const fileData = await getFileRes.json();
        sha = fileData.sha;
      }
      const contentB64 = Buffer.from(JSON.stringify(updatedData, null, 2)).toString('base64');
      const putRes = await fetch(`https://api.github.com/repos/${ghRepo}/contents/data/flowcharts.json`, {
        method: 'PUT',
        headers: { Authorization: `token ${ghToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'admin: update flowcharts.json data',
          content: contentB64,
          sha: sha || undefined,
        }),
      });
      if (putRes.ok) {
        savedSuccess = true;
        activeProvider = 'GitHub API';
      }
    } catch (err) {
      console.warn('GitHub API save failed:', err);
    }
  }

  // 6. Local fs write (for localhost dev)
  try {
    const filePath = getFilePath();
    await fs.writeFile(filePath, JSON.stringify(updatedData, null, 2), 'utf-8');
    savedSuccess = true;
    if (activeProvider === 'memory') activeProvider = 'Local File (data/flowcharts.json)';
  } catch (err) {
    console.warn('Local fs write skipped (serverless environment)');
  }

  return {
    success: true,
    provider: activeProvider,
  };
}
