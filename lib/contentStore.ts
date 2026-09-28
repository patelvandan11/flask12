import fs from 'fs/promises';
import path from 'path';
import clientPromise from './mongodb';
import { explorations as defaultExplorations } from '@/data/explorations';

const getDataFilePath = (fileName: string) => path.join(process.cwd(), 'data', fileName);

// Generic loader for any collection
async function loadCollectionData<T>(
  collectionName: string,
  configId: string,
  jsonFileName: string,
  defaultFallback?: T
): Promise<T> {
  // 1. Live MongoDB Database
  if (process.env.MONGODB_URI && clientPromise) {
    try {
      const client = await clientPromise;
      const dbName = process.env.MONGODB_DB || 'portfolio_db';
      const db = client.db(dbName);
      const doc = await db.collection(collectionName).findOne({ _id: configId as any });

      if (doc && doc.data) {
        return doc.data as T;
      }
    } catch (err) {
      console.warn(`MongoDB read error for ${collectionName}:`, err);
    }
  }

  // 2. Fallback to local data/*.json or provided default
  try {
    const filePath = getDataFilePath(jsonFileName);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (err) {
    if (defaultFallback) return defaultFallback;
    console.error(`Error reading local ${jsonFileName}:`, err);
    throw err;
  }
}

// Generic saver for any collection
async function saveCollectionData<T>(
  collectionName: string,
  configId: string,
  jsonFileName: string,
  newData: T
): Promise<{ success: boolean; provider: string }> {
  let activeProvider = 'memory';

  // 1. Live MongoDB Database
  if (process.env.MONGODB_URI && clientPromise) {
    try {
      const client = await clientPromise;
      const dbName = process.env.MONGODB_DB || 'portfolio_db';
      const db = client.db(dbName);
      await db.collection(collectionName).updateOne(
        { _id: configId as any },
        { $set: { data: newData, updatedAt: new Date() } },
        { upsert: true }
      );
      return { success: true, provider: 'Live MongoDB Database' };
    } catch (err) {
      console.warn(`MongoDB save error for ${collectionName}:`, err);
    }
  }

  // 2. Local File Save fallback
  try {
    const filePath = getDataFilePath(jsonFileName);
    await fs.writeFile(filePath, JSON.stringify(newData, null, 2), 'utf-8');
    activeProvider = 'Local File';
  } catch (err) {
    console.warn(`Local fs write skipped for ${jsonFileName} (serverless environment)`);
  }

  return { success: true, provider: activeProvider };
}

// --- ART ---
export async function getArtData() {
  return loadCollectionData<any[]>('art', 'art_config', 'art.json');
}
export async function saveArtData(data: any[]) {
  return saveCollectionData<any[]>('art', 'art_config', 'art.json', data);
}

// --- BLOG ---
export async function getBlogData() {
  return loadCollectionData<any[]>('blogs', 'blog_config', 'blog.json');
}
export async function saveBlogData(data: any[]) {
  return saveCollectionData<any[]>('blogs', 'blog_config', 'blog.json', data);
}

// --- PROJECTS ---
export async function getProjectsData() {
  return loadCollectionData<any[]>('projects', 'projects_config', 'projects.json');
}
export async function saveProjectsData(data: any[]) {
  return saveCollectionData<any[]>('projects', 'projects_config', 'projects.json', data);
}

// --- RESUME ---
export async function getResumeData() {
  return loadCollectionData<Record<string, any>>('resume', 'resume_config', 'resume.json');
}
export async function saveResumeData(data: Record<string, any>) {
  return saveCollectionData<Record<string, any>>('resume', 'resume_config', 'resume.json', data);
}

// --- EXPLORATIONS / EXPLORE PAGE ---
export async function getExplorationsData() {
  return loadCollectionData<any[]>('explorations', 'explorations_config', 'explorations.json', defaultExplorations);
}
export async function saveExplorationsData(data: any[]) {
  return saveCollectionData<any[]>('explorations', 'explorations_config', 'explorations.json', data);
}
