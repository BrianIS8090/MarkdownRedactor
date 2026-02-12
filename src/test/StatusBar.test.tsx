import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBar } from '../components/StatusBar/StatusBar';
import { useAppStore } from '../stores/appStore';

describe('StatusBar', () => {
  beforeEach(() => {
    useAppStore.setState({
      filePath: null,
      content: '',
      editorMode: 'visual',
      language: 'ru',
    });
  });

  it('должен показывать "Новый файл" когда нет пути', () => {
    render(<StatusBar />);
    expect(screen.getByText('Новый файл')).toBeInTheDocument();
  });

  it('должен показывать путь к файлу', () => {
    useAppStore.setState({ filePath: 'C:\\docs\\test.md' });
    render(<StatusBar />);
    expect(screen.getByText('C:\\docs\\test.md')).toBeInTheDocument();
  });

  it('должен считать слова и символы', () => {
    useAppStore.setState({ content: 'Привет мир тест' });
    render(<StatusBar />);
    expect(screen.getByText(/3 слова/)).toBeInTheDocument();
  });

  it('должен показывать 0 слов для пустого контента', () => {
    useAppStore.setState({ content: '' });
    render(<StatusBar />);
    expect(screen.getByText(/0 слов/)).toBeInTheDocument();
  });

  it('должен показывать режим редактора', () => {
    useAppStore.setState({ editorMode: 'source' });
    render(<StatusBar />);
    expect(screen.getByText('Исходный')).toBeInTheDocument();
  });
});
