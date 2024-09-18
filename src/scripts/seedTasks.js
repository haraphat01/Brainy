import dbConnect from '../lib/dbConnect';
import Task from '../model/Task';

const sampleTasks = [
  { id: 'task1', name: 'Complete profile', credits: 10 },
  { id: 'task2', name: 'Invite a friend', credits: 20 },
  { id: 'task3', name: 'Play the game', credits: 5 },
  { id: 'task4', name: 'Follow us on Twitter', credits: 15, link: 'https://twitter.com/youraccount' },
  { id: 'task5', name: 'Like our Facebook page', credits: 15, link: 'https://facebook.com/yourpage' },
  { id: 'task6', name: 'Subscribe to our YouTube channel', credits: 25, link: 'https://youtube.com/yourchannel' },
  { id: 'task7', name: 'Follow us on Instagram', credits: 15, link: 'https://instagram.com/youraccount' },
  { id: 'task8', name: 'Join our Discord server', credits: 20, link: 'https://discord.gg/yourinvite' },
  { id: 'task9', name: 'Share a post about us on LinkedIn', credits: 30, link: 'https://linkedin.com/company/yourcompany' },
];

const seedTasks = async () => {
  await dbConnect();
  
  // Clear existing tasks
  await Task.deleteMany({});

  // Insert sample tasks
  await Task.insertMany(sampleTasks);
  console.log('Sample tasks inserted successfully!');
};

seedTasks().catch(err => {
  console.error('Error inserting tasks:', err);
  process.exit(1);
});