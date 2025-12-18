import { describe, it, expect } from 'vitest';
import { getStackZIndex, getDrawerSize } from '../src/utils';

describe('getStackZIndex', () => {
  it('should return base z-index for depth 0', () => {
    expect(getStackZIndex(0)).toBe(9000);
  });

  it('should increment by 10 per stack depth', () => {
    expect(getStackZIndex(1)).toBe(9010);
    expect(getStackZIndex(2)).toBe(9020);
    expect(getStackZIndex(3)).toBe(9030);
  });

  it('should handle large stack depths', () => {
    expect(getStackZIndex(10)).toBe(9100);
    expect(getStackZIndex(100)).toBe(10000);
  });
});

describe('getDrawerSize', () => {
  describe('horizontal drawers (left/right)', () => {
    it('should return correct sm size', () => {
      expect(getDrawerSize('sm', 'left')).toBe('280px');
      expect(getDrawerSize('sm', 'right')).toBe('280px');
    });

    it('should return correct md size', () => {
      expect(getDrawerSize('md', 'left')).toBe('380px');
      expect(getDrawerSize('md', 'right')).toBe('380px');
    });

    it('should return correct lg size', () => {
      expect(getDrawerSize('lg', 'left')).toBe('520px');
      expect(getDrawerSize('lg', 'right')).toBe('520px');
    });

    it('should return correct xl size', () => {
      expect(getDrawerSize('xl', 'left')).toBe('720px');
      expect(getDrawerSize('xl', 'right')).toBe('720px');
    });

    it('should return correct full size', () => {
      expect(getDrawerSize('full', 'left')).toBe('100vw');
      expect(getDrawerSize('full', 'right')).toBe('100vw');
    });
  });

  describe('vertical drawers (top/bottom)', () => {
    it('should return correct sm size', () => {
      expect(getDrawerSize('sm', 'top')).toBe('200px');
      expect(getDrawerSize('sm', 'bottom')).toBe('200px');
    });

    it('should return correct md size', () => {
      expect(getDrawerSize('md', 'top')).toBe('300px');
      expect(getDrawerSize('md', 'bottom')).toBe('300px');
    });

    it('should return correct lg size', () => {
      expect(getDrawerSize('lg', 'top')).toBe('400px');
      expect(getDrawerSize('lg', 'bottom')).toBe('400px');
    });

    it('should return correct xl size', () => {
      expect(getDrawerSize('xl', 'top')).toBe('560px');
      expect(getDrawerSize('xl', 'bottom')).toBe('560px');
    });

    it('should return correct full size', () => {
      expect(getDrawerSize('full', 'top')).toBe('100vh');
      expect(getDrawerSize('full', 'bottom')).toBe('100vh');
    });
  });

  describe('different sizes for horizontal vs vertical', () => {
    it('should return different values for same size in different orientations', () => {
      expect(getDrawerSize('sm', 'left')).not.toBe(getDrawerSize('sm', 'top'));
      expect(getDrawerSize('lg', 'right')).not.toBe(getDrawerSize('lg', 'bottom'));
    });
  });
});
