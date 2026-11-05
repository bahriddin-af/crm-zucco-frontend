import { heightClass, percentChange, widthClass } from './reportMath'

describe('reportMath', () => {
  it('maps ratios onto the fixed width scale', () => {
    expect(widthClass(0, 100)).toBe('w-0')
    expect(widthClass(100, 100)).toBe('w-full')
    expect(widthClass(50, 100)).toBe('w-6/12')
    expect(widthClass(1, 1000)).toBe('w-1/12')
    expect(widthClass(10, 0)).toBe('w-0')
  })

  it('maps ratios onto the fixed height scale', () => {
    expect(heightClass(0, 10)).toBe('h-0')
    expect(heightClass(10, 10)).toBe('h-40')
    expect(heightClass(5, 10)).toBe('h-20')
  })

  it('computes the change against the previous month', () => {
    expect(percentChange(120, 100)).toBe(20)
    expect(percentChange(50, -100)).toBe(150)
    expect(percentChange(10, 0)).toBeNull()
  })
})
