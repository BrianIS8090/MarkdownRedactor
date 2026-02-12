import { invoke } from '@tauri-apps/api/core';
import type { FileData, Settings } from '../types';

// Обёртки над Tauri IPC-командами

export async function openFile(): Promise<FileData> {
  return invoke<FileData>('open_file');
}

export async function saveFile(path: string, content: string): Promise<boolean> {
  return invoke<boolean>('save_file', { path, content });
}

export async function saveFileAs(content: string): Promise<string | null> {
  return invoke<string | null>('save_file_as', { content });
}

export async function readSettings(): Promise<Settings> {
  return invoke<Settings>('read_settings');
}

export async function writeSettings(settings: Settings): Promise<boolean> {
  return invoke<boolean>('write_settings', { settings });
}

export async function getRecentFiles(): Promise<string[]> {
  return invoke<string[]>('get_recent_files');
}

// Чтение файла по пути (для открытия через ассоциацию)
export async function readFile(path: string): Promise<string> {
  return invoke<string>('read_file', { path });
}

// Получить путь к файлу, переданному при запуске приложения
export async function getPendingFile(): Promise<string | null> {
  return invoke<string | null>('get_pending_file');
}
