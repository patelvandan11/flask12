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

async function seedMongo() {
  const client = new MongoClient(uri);
  try {
    console.log('Connecting to Live MongoDB Atlas...');
    await client.connect();
    console.log('✅ Connected to Live MongoDB Atlas successfully!');
    const db = client.db('portfolio_db');

    // 1. Flowcharts
    const flowchartsData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'data', 'flowcharts.json'), 'utf-8')
    );
    await db.collection('flowcharts').updateOne(
      { _id: 'flowcharts_config' },
      { $set: { data: flowchartsData, updatedAt: new Date() } },
      { upsert: true }
    );
    console.log('🎉 Initialized flowcharts in MongoDB Atlas!');

    // 2. Art
    const artData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'data', 'art.json'), 'utf-8')
    );
    await db.collection('art').updateOne(
      { _id: 'art_config' },
      { $set: { data: artData, updatedAt: new Date() } },
      { upsert: true }
    );
    console.log('🎉 Initialized art in MongoDB Atlas!');

    // 3. Blog
    const blogData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'data', 'blog.json'), 'utf-8')
    );
    await db.collection('blogs').updateOne(
      { _id: 'blog_config' },
      { $set: { data: blogData, updatedAt: new Date() } },
      { upsert: true }
    );
    console.log('🎉 Initialized blogs in MongoDB Atlas!');

    // 4. Projects
    const projectsData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'data', 'projects.json'), 'utf-8')
    );
    await db.collection('projects').updateOne(
      { _id: 'projects_config' },
      { $set: { data: projectsData, updatedAt: new Date() } },
      { upsert: true }
    );
    console.log('🎉 Initialized projects in MongoDB Atlas!');

    // 5. Resume
    const resumeData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'data', 'resume.json'), 'utf-8')
    );
    await db.collection('resume').updateOne(
      { _id: 'resume_config' },
      { $set: { data: resumeData, updatedAt: new Date() } },
      { upsert: true }
    );
    console.log('🎉 Initialized resume in MongoDB Atlas!');

    console.log('✅ ALL JSON datasets successfully seeded to MongoDB Atlas!');
  } catch (err) {
    console.error('❌ MongoDB Atlas Seeding Error:', err);
  } finally {
    await client.close();
  }
}

seedMongo();
