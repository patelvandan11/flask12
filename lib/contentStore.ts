import clientPromise from './mongodb';
import { explorations as defaultExplorations } from '@/data/explorations';
import { BeyondCodingData } from '@/types/portfolio';

// Generic loader for any collection from MongoDB
export async function loadCollectionData<T>(
  collectionName: string,
  configId: string,
  defaultFallback?: T
): Promise<T> {
  if (clientPromise) {
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

  return (defaultFallback ?? ([] as unknown as T)) as T;
}

// Generic saver for any collection to MongoDB
export async function saveCollectionData<T>(
  collectionName: string,
  configId: string,
  newData: T
): Promise<{ success: boolean; provider: string }> {
  if (clientPromise) {
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
      console.error(`MongoDB save error for ${collectionName}:`, err);
      throw err;
    }
  }

  return { success: false, provider: 'MongoDB not connected' };
}

// --- ART ---
export async function getArtData() {
  return loadCollectionData<any[]>('art', 'art_config', []);
}
export async function saveArtData(data: any[]) {
  return saveCollectionData<any[]>('art', 'art_config', data);
}

// --- BLOG ---
export async function getBlogData() {
  return loadCollectionData<any[]>('blogs', 'blog_config', []);
}
export async function saveBlogData(data: any[]) {
  return saveCollectionData<any[]>('blogs', 'blog_config', data);
}

// --- PROJECTS ---
export async function getProjectsData() {
  return loadCollectionData<any[]>('projects', 'projects_config', []);
}
export async function saveProjectsData(data: any[]) {
  return saveCollectionData<any[]>('projects', 'projects_config', data);
}

// --- RESUME ---
export async function getResumeData() {
  return loadCollectionData<Record<string, any>>('resume', 'resume_config', {});
}
export async function saveResumeData(data: Record<string, any>) {
  return saveCollectionData<Record<string, any>>('resume', 'resume_config', data);
}

// --- EXPLORATIONS / EXPLORE PAGE ---
export async function getExplorationsData() {
  return loadCollectionData<any[]>('explorations', 'explorations_config', defaultExplorations);
}
export async function saveExplorationsData(data: any[]) {
  return saveCollectionData<any[]>('explorations', 'explorations_config', data);
}

// --- BEYOND CODING ---
export async function getBeyondCodingData(): Promise<BeyondCodingData> {
  return loadCollectionData<BeyondCodingData>('beyond_coding', 'beyond_config', {
    year: 2026,
    title: 'Life Logs — Digital Scrapbook & Planner',
    subtitle: 'A soft, cozy memory calendar capturing everyday moments, art, travels, and little joys — personal life logs.',
    months: [],
    memories: [],
  });
}
export async function saveBeyondCodingData(data: BeyondCodingData) {
  return saveCollectionData<BeyondCodingData>('beyond_coding', 'beyond_config', data);
}
