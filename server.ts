import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { apiRouter } from './server/api.ts';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use('/api', apiRouter);

// Serve static frontend in production
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));

app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`AI Story Creator server listening on port ${port}`);
});
