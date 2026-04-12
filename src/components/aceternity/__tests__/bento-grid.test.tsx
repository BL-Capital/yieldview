// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BentoGrid } from '../bento-grid'
import { BentoGridItem } from '../bento-grid-item'

describe('BentoGrid', () => {
  it('renders children', () => {
    render(
      <BentoGrid>
        <BentoGridItem title="CAC 40" />
        <BentoGridItem title="VIX" />
      </BentoGrid>,
    )
    expect(screen.getByText('CAC 40')).toBeTruthy()
    expect(screen.getByText('VIX')).toBeTruthy()
  })
})

describe('BentoGridItem', () => {
  it('renders title and description', () => {
    render(<BentoGridItem title="S&P 500" description="Indice américain" />)
    expect(screen.getByText('S&P 500')).toBeTruthy()
    expect(screen.getByText('Indice américain')).toBeTruthy()
  })

  it('renders children', () => {
    render(<BentoGridItem><span>custom content</span></BentoGridItem>)
    expect(screen.getByText('custom content')).toBeTruthy()
  })
})
