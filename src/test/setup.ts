import '@testing-library/jest-dom'

// Mock Audio API
class MockAudio {
  src: string = ''
  volume: number = 1
  loop: boolean = false
  
  play(): Promise<void> {
    return Promise.resolve()
  }
  
  pause(): void {}
  
  load(): void {}
}

global.Audio = MockAudio as unknown as typeof Audio

// Mock Notification API
global.Notification = {
  permission: 'default',
  requestPermission: vi.fn().mockResolvedValue('granted'),
} as unknown as typeof Notification

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
