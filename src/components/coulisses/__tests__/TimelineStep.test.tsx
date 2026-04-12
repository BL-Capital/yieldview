// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TimelineStep } from '../TimelineStep'

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) =>
      <div {...props}>{children}</div>,
  },
}))

describe('TimelineStep', () => {
  it('renders step number', () => {
    render(<TimelineStep step={3} title="Title" description="Desc" />)
    expect(screen.getByText('3')).toBeTruthy()
  })

  it('renders title and description', () => {
    render(<TimelineStep step={1} title="Mon titre" description="Ma description" />)
    expect(screen.getByText('Mon titre')).toBeTruthy()
    expect(screen.getByText('Ma description')).toBeTruthy()
  })

  it('renders date badge when provided', () => {
    render(<TimelineStep step={1} title="T" description="D" date="Semaine 1" />)
    expect(screen.getByText('Semaine 1')).toBeTruthy()
  })

  it('does not render date badge when omitted', () => {
    render(<TimelineStep step={1} title="T" description="D" />)
    expect(screen.queryByText('Semaine 1')).toBeNull()
  })

  it('renders media slot', () => {
    render(
      <TimelineStep step={1} title="T" description="D" media={<img alt="media" />} />,
    )
    expect(screen.getByAltText('media')).toBeTruthy()
  })

  it('renders children slot', () => {
    render(
      <TimelineStep step={1} title="T" description="D">
        <span>Child content</span>
      </TimelineStep>,
    )
    expect(screen.getByText('Child content')).toBeTruthy()
  })

  it('does not render connector line when isLast=true', () => {
    const { container } = render(
      <TimelineStep step={1} title="T" description="D" isLast />,
    )
    // When isLast, the gradient line div is not rendered
    const line = container.querySelector('.bg-gradient-to-b')
    expect(line).toBeNull()
  })

  it('renders connector line when isLast=false', () => {
    const { container } = render(
      <TimelineStep step={1} title="T" description="D" isLast={false} />,
    )
    const line = container.querySelector('.bg-gradient-to-b')
    expect(line).toBeTruthy()
  })
})
