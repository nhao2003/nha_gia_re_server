import { DataSource } from 'typeorm';
import { initApp } from './app';
import { Express } from 'express';
export async function startServer(dataSource: DataSource): Promise<Express> {
  await dataSource.initialize();
  console.log('Database connected');
  return initApp();
}
