require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Admin = require('./models/Admin');
const PottiInfo = require('./models/PottiInfo');
const TrustCard = require('./models/TrustCard');
const Activity = require('./models/Activity');
const GalleryItem = require('./models/GalleryItem');
const ContactInfo = require('./models/ContactInfo');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Seed Admin
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (!existingAdmin) {
      const hashedPass = await bcrypt.hash('trust@1952', 10);
      await Admin.create({ username: 'admin', password: hashedPass });
      console.log('✅ Admin user created (admin / trust@1952)');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Seed Potti Info
    const existingPotti = await PottiInfo.findOne();
    if (!existingPotti) {
      await PottiInfo.create({
        nte: 'అమరజీవి పొట్టి శ్రీరాములు',
        nen: 'Amarajivi Potti Sriramulu',
        dates: '16 March 1901 – 15 December 1952',
        p1te: 'పొట్టి శ్రీరాములు 1901 మార్చి 16న నెల్లూరు జిల్లాలో జన్మించారు. ఆయన మహాత్మా గాంధీ అనుచరుడిగా స్వాతంత్ర్య పోరాటంలో చురుకుగా పాల్గొన్నారు.',
        p1en: "Potti Sriramulu was born on 16 March 1901 in Nellore district. A devoted follower of Mahatma Gandhi, he actively participated in India's freedom struggle.",
        qte: '"తెలుగు వారికి ప్రత్యేక రాష్ట్రం వస్తే తప్ప నేను అన్నం తినను" – పొట్టి శ్రీరాములు',
        qen: '"I shall not eat until a separate state is formed for Telugu-speaking people." – Potti Sriramulu',
        p2te: '1952లో ఆంధ్ర రాష్ట్రం కోసం 58 రోజులు నిరాహార దీక్ష చేసి ప్రాణాలు అర్పించారు. ఆయన త్యాగం వలనే 1953లో ఆంధ్ర రాష్ట్రం ఏర్పడింది.',
        p2en: 'In 1952, he undertook a 58-day fast-unto-death demanding a separate Andhra state. His supreme sacrifice led to the formation of Andhra State in 1953.',
        photo: 'assets/potti.jpg',
        chips: '🗓️ జన్మ: 1901, 📍 నెల్లూరు, 🕊️ గాంధేయవాది, 🏛️ ఆంధ్ర రాష్ట్ర నిర్మాత'
      });
      console.log('✅ Potti info seeded');
    } else {
      console.log('ℹ️  Potti info already exists');
    }

    // Seed Trust Cards (Committee Members)
    const trustCount = await TrustCard.countDocuments();
    if (trustCount === 0) {
      await TrustCard.insertMany([
        { tte: 'మా లక్ష్యం', ten: 'Our Mission', cte: 'అమరజీవి పొట్టి శ్రీరాములు ఆదర్శాలను నిలబెట్టడం, తెలుగు సంస్కృతిని కాపాడటం.', cen: 'Upholding the ideals of Amarajivi Potti Sriramulu and preserving Telugu culture.' },
        { tte: 'మా దృష్టి', ten: 'Our Vision', cte: 'అందరికీ విద్య, ఆరోగ్యం మరియు సమాన అవకాశాలు అందించడం.', cen: 'Building an ideal society by providing education, healthcare and equal opportunities.' },
        { tte: 'మా బలం', ten: 'Our Strength', cte: 'వేలాది మంది సభ్యులు మరియు సేవా నిబద్ధత మా బలం.', cen: 'Thousands of committed members and dedication to service form our foundation.' },
        { tte: 'నమోదు వివరాలు', ten: 'Registration', cte: 'అధికారికంగా నమోదు చేయబడిన స్వచ్ఛంద సంస్థ.', cen: 'Officially registered charitable organization operating transparently.' },
        { tte: 'భాగస్వాములు', ten: 'Partners', cte: 'ప్రభుత్వ సంస్థలు మరియు NGOలతో కలిసి పని చేస్తాం.', cen: 'We collaborate with government bodies and NGOs for meaningful service.' },
        { tte: 'మా సాధనలు', ten: 'Achievements', cte: '10,000+ విద్యార్థులకు ఉపకార వేతనాలు, 500+ వైద్య శిబిరాలు.', cen: 'Scholarships to 10,000+ students and 500+ free medical camps.' }
      ]);
      console.log('✅ Trust cards seeded (6 items)');
    } else {
      console.log('ℹ️  Trust cards already exist');
    }

    // Seed Activities
    const actCount = await Activity.countDocuments();
    if (actCount === 0) {
      await Activity.insertMany([
        { tte: 'విద్యా సేవలు', ten: 'Educational Services', dte: 'పేద విద్యార్థులకు ఉపకార వేతనాలు, పాఠ్యపుస్తకాలు అందించడం.', den: 'Providing scholarships, textbooks, and school fees for underprivileged students.' },
        { tte: 'వైద్య సేవలు', ten: 'Medical Services', dte: 'ఉచిత వైద్య శిబిరాలు, రక్తదాన శిబిరాలు నిర్వహించడం.', den: 'Organizing free medical camps, blood donation drives and medicine distribution.' },
        { tte: 'రైతు సేవలు', ten: 'Farmer Support', dte: 'రైతులకు ఆధునిక వ్యవసాయ విధానాలు నేర్పించడం.', den: 'Training farmers in modern agricultural methods and providing calamity support.' },
        { tte: 'సాంస్కృతిక కార్యక్రమాలు', ten: 'Cultural Programs', dte: 'తెలుగు సాహిత్యం మరియు కళలను ప్రోత్సహించడం.', den: 'Promoting Telugu literature, arts and culture through events and gatherings.' },
        { tte: 'మహిళా సాధికారత', ten: 'Women Empowerment', dte: 'మహిళలకు నైపుణ్య శిక్షణ మరియు ఉపాధి అవకాశాలు.', den: 'Providing skill training and self-employment opportunities for women.' },
        { tte: 'పర్యావరణ సేవలు', ten: 'Environmental Services', dte: 'వృక్షారోపణ మరియు నీటి సంరక్షణ కార్యక్రమాలు.', den: 'Tree planting programs and water conservation campaigns.' }
      ]);
      console.log('✅ Activities seeded (6 items)');
    } else {
      console.log('ℹ️  Activities already exist');
    }

    // Seed Gallery
    const galCount = await GalleryItem.countDocuments();
    if (galCount === 0) {
      await GalleryItem.insertMany([
        { photos: [], lte: 'వార్షిక సభ 2024', len: 'Annual Event 2024' },
        { photos: [], lte: 'వైద్య శిబిరం', len: 'Medical Camp' },
        { photos: [], lte: 'పుస్తక పంపిణీ', len: 'Book Distribution' },
        { photos: [], lte: 'వృక్షారోపణ', len: 'Tree Plantation' },
        { photos: [], lte: 'సాంస్కృతిక కార్యక్రమం', len: 'Cultural Event' },
        { photos: [], lte: 'రక్తదాన శిబిరం', len: 'Blood Donation Camp' },
        { photos: [], lte: 'పురస్కార సమర్పణ', len: 'Award Ceremony' }
      ]);
      console.log('✅ Gallery items seeded (7 items)');
    } else {
      console.log('ℹ️  Gallery items already exist');
    }

    // Seed Contact Info
    const existingCI = await ContactInfo.findOne();
    if (!existingCI) {
      await ContactInfo.create({
        addrTe: 'పొట్టి శ్రీరాములు ట్రస్ట్ భవనం,\nవిజయనగరం, ఆంధ్రప్రదేశ్ – 535001',
        addrEn: 'Potti Sriramulu Trust Bhavan,\nVizianagaram, Andhra Pradesh - 535001',
        ph: '+91 98765 43210\n+91 98765 43211',
        em: 'info@pottisriramulutrust.org',
        hrTe: 'సోమవారం – శనివారం: ఉ. 9:00 – సా. 6:00',
        hrEn: 'Monday – Saturday: 9:00 AM – 6:00 PM'
      });
      console.log('✅ Contact info seeded');
    } else {
      console.log('ℹ️  Contact info already exists');
    }

    console.log('\n🎉 Seed completed successfully!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
