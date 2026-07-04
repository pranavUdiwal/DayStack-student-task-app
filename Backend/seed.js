/**
 * Seed Script — Populates the database with a demo user and sample journals.
 *
 * Usage:  node seed.js
 *
 * Demo user credentials (printed at the end):
 *   Email:    demo@daystack.com
 *   Password: Demo@1234
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./src/models/user.model');
const Journal = require('./src/models/journal.model');

const DEMO_EMAIL = 'demo@daystack.com';
const DEMO_PASSWORD = 'Demo@1234';

const seedJournals = [
  {
    title: 'Understanding Closures in JavaScript',
    content:
      'Spent 45 minutes diving deep into JavaScript closures. A closure is formed when a function retains access to its lexical scope even after the outer function has returned. Practiced by building a counter factory and a private-variable module pattern. Key insight: closures are not snapshots — they hold live references to variables, so mutations inside the closure are reflected outside too.',
    duration: 45,
    difficulty: 'Medium',
    createdAt: daysAgo(0),
  },
  {
    title: 'React useEffect Cleanup Patterns',
    content:
      'Studied the importance of cleanup functions in useEffect. Without proper cleanup, event listeners and timers can leak memory. Implemented an example where a WebSocket connection is opened on mount and cleanly closed on unmount. Also explored the subtle difference between an empty dependency array (run once) and no dependency array (run every render).',
    duration: 60,
    difficulty: 'Hard',
    createdAt: daysAgo(1),
  },
  {
    title: 'CSS Grid vs Flexbox — When to Use What',
    content:
      'Compared CSS Grid and Flexbox side by side. Grid excels at two-dimensional layouts (rows AND columns), while Flexbox is ideal for one-dimensional flow (either a row or a column). Built a responsive photo gallery with Grid and a navigation bar with Flexbox to solidify the concepts. Takeaway: they are complementary, not competing, tools.',
    duration: 35,
    difficulty: 'Easy',
    createdAt: daysAgo(2),
  },
  {
    title: 'Node.js Streams & Backpressure',
    content:
      'Explored readable and writable streams in Node.js. Practiced piping a large CSV file through a transform stream that filters rows by a condition. Learned about backpressure — when the writable stream cannot keep up, the readable stream pauses automatically. This prevents memory from ballooning when processing gigabyte-scale files.',
    duration: 50,
    difficulty: 'Hard',
    createdAt: daysAgo(3),
  },
  {
    title: 'MongoDB Aggregation Pipeline Basics',
    content:
      'Walked through the core aggregation stages: $match, $group, $sort, $project, and $lookup. Built a pipeline that groups journal entries by difficulty level and computes average duration per group. Also experimented with $unwind for flattening arrays. The pipeline model feels very natural — each stage transforms the data for the next.',
    duration: 40,
    difficulty: 'Medium',
    createdAt: daysAgo(4),
  },
  {
    title: 'Introduction to JWT Authentication',
    content:
      'Studied JSON Web Tokens from scratch. A JWT has three parts — Header, Payload, and Signature — base64-encoded and dot-separated. Implemented a login flow that issues a JWT on success and a middleware that verifies tokens on protected routes. Important caveat: JWTs are stateless, so revocation requires an additional strategy like a blacklist or short expiry + refresh tokens.',
    duration: 55,
    difficulty: 'Medium',
    createdAt: daysAgo(5),
  },
  {
    title: 'Git Branching Strategies for Teams',
    content:
      'Read about Git Flow, GitHub Flow, and Trunk-Based Development. Git Flow uses long-lived develop and release branches — good for versioned software but heavy for web apps. GitHub Flow keeps it simple: one main branch + short-lived feature branches merged via pull requests. Trunk-Based Development pushes for even smaller, more frequent merges. For our project size, GitHub Flow seems ideal.',
    duration: 30,
    difficulty: 'Easy',
    createdAt: daysAgo(6),
  },
];

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(10, 0, 0, 0);
  return d;
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✔  Connected to MongoDB');

    // ---- Upsert demo user ------------------------------------------------
    let user = await User.findOne({ email: DEMO_EMAIL });

    if (user) {
      console.log('ℹ  Demo user already exists — updating password & bio');
      user.password = await bcrypt.hash(DEMO_PASSWORD, 10);
      user.name = 'Alex Rivera';
      user.bio = 'Cognitive Science & Full-Stack Development';
      await user.save();
    } else {
      const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);
      user = await User.create({
        name: 'Alex Rivera',
        email: DEMO_EMAIL,
        password: hashedPassword,
        bio: 'Cognitive Science & Full-Stack Development',
      });
      console.log('✔  Demo user created');
    }

    // ---- Seed journals (only if fewer than 7 exist) ----------------------
    const existingCount = await Journal.countDocuments({ user: user._id });

    if (existingCount >= 7) {
      console.log(`ℹ  ${existingCount} journals already exist — skipping`);
    } else {
      // Remove any partial seed data so we start clean
      await Journal.deleteMany({ user: user._id });

      const docs = seedJournals.map((j) => ({
        ...j,
        user: user._id,
      }));
      await Journal.insertMany(docs);
      console.log(`✔  ${docs.length} sample journals inserted`);
    }

    // ---- Print credentials ------------------------------------------------
    console.log('\n===================================================');
    console.log('  DEMO USER CREDENTIALS');
    console.log('---------------------------------------------------');
    console.log(`  Email:    ${DEMO_EMAIL}`);
    console.log(`  Password: ${DEMO_PASSWORD}`);
    console.log('===================================================\n');

    await mongoose.disconnect();
    console.log('✔  Done — disconnected from MongoDB');
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
