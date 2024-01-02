import { v4 as uuidv4 } from 'uuid';
export function genFloatNumber(from: number, to: number): number {
  return Math.round((Math.random() * (to - from) + from) * 100) / 100;
}

export function functionGenPictureUrl(): string {
  // https://picsum.photos/200/300?random=1
  const random = Math.round(Math.random() * 1000000000);
  return `https://picsum.photos/200/300?random=${random}`;
}

export function genArrayPictureUrl(length?: number): string[] {
  length = length || Math.round(Math.random() * 10);
  const result: string[] = [];
  for (let i = 0; i < length; i++) {
    result.push(functionGenPictureUrl());
  }
  return result;
}

export function generateRandomText(length: number = 100, words?: string[]): string {
  if (!words) {
    // Sử dụng một danh sách từ vựng ngẫu nhiên để sinh văn bản
    words = ['apple', 'banana', 'orange', 'dog', 'cat', 'sun', 'moon', 'happy', 'sad', 'random'];
  }

  const randomText: string[] = [];

  for (let i = 0; i < length; i++) {
    const word: string = words[Math.floor(Math.random() * words.length)];
    randomText.push(word);
  }

  return randomText.join(' ');
}

export function genRandomDate(from: Date, to: Date): Date {
  return new Date(from.getTime() + Math.random() * (to.getTime() - from.getTime()));
}

export function genUUID(): string {
  return uuidv4();
}

