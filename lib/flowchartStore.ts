import clientPromise from './mongodb';

// In-memory cache for fast response
let memoryFlowchartsCache: Record<string, any> | null = null;

export async function getFlowchartsData(): Promise<Record<string, any>> {
  // 1. Live MongoDB Database
  if (clientPromise) {
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
      console.warn('MongoDB read error for flowcharts:', err);
    }
  }

  // 2. In-Memory Cache fallback
  if (memoryFlowchartsCache) {
    return memoryFlowchartsCache;
  }

  return {};
}

export async function saveFlowchartsData(updatedData: Record<string, any>): Promise<{ success: boolean; provider: string; error?: string }> {
  // Update in-memory cache
  memoryFlowchartsCache = updatedData;

  // 1. Live MongoDB Database
  if (clientPromise) {
    try {
      const client = await clientPromise;
      const dbName = process.env.MONGODB_DB || 'portfolio_db';
      const db = client.db(dbName);
      await db.collection('flowcharts').updateOne(
        { _id: 'flowcharts_config' as any },
        { $set: { data: updatedData, updatedAt: new Date() } },
        { upsert: true }
      );
      return { success: true, provider: 'Live MongoDB Database' };
    } catch (err) {
      console.error('MongoDB save error for flowcharts:', err);
      return { success: false, provider: 'MongoDB Error', error: String(err) };
    }
  }

  return {
    success: true,
    provider: 'Memory Cache',
  };
}
