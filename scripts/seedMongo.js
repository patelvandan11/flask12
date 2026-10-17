const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const dns = require('dns');

// Set public DNS servers to resolve MongoDB Atlas SRV records reliably
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // fallback if environment locks dns.setServers
}

const uri = 'mongodb+srv://meivaninfo_db_user:uZh6Ml7pWgfBUPxL@portfolio.lonyqkm.mongodb.net/portfolio_db?retryWrites=true&w=majority&appName=portfolio';

async function checkOrSeedMongo() {
  const client = new MongoClient(uri);
  try {
    console.log('Connecting to Live MongoDB Atlas...');
    await client.connect();
    console.log('✅ Connected to Live MongoDB Atlas successfully!');
    const db = client.db('portfolio_db');

    const collections = [
      { name: 'flowcharts', id: 'flowcharts_config', file: 'flowcharts.json' },
      { name: 'art', id: 'art_config', file: 'art.json' },
      { name: 'blogs', id: 'blog_config', file: 'blog.json' },
      { name: 'projects', id: 'projects_config', file: 'projects.json' },
      { name: 'resume', id: 'resume_config', file: 'resume.json' },
      { name: 'beyond_coding', id: 'beyond_config', file: 'beyondCoding.json' },
      { name: 'explorations', id: 'explorations_config', file: 'explorations.json' },
    ];

    for (const col of collections) {
      const filePath = path.join(process.cwd(), 'data', col.file);
      if (fs.existsSync(filePath)) {
        const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        await db.collection(col.name).updateOne(
          { _id: col.id },
          { $set: { data: fileContent, updatedAt: new Date() } },
          { upsert: true }
        );
        console.log(`🎉 Seeded ${col.name} from local ${col.file} to MongoDB Atlas!`);
      } else {
        const existing = await db.collection(col.name).findOne({ _id: col.id });
        if (existing && existing.data) {
          console.log(`✅ Live MongoDB Atlas has active collection [${col.name}] (pure MongoDB mode)`);
        } else {
          console.log(`ℹ️ [${col.name}] in MongoDB Atlas ready for writes.`);
        }
      }
    }

    console.log('✅ MongoDB Atlas verification complete! Running purely on MongoDB.');
  } catch (err) {
    console.error('❌ MongoDB Atlas Error:', err);
  } finally {
    await client.close();
  }
}

checkOrSeedMongo();
