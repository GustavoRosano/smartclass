import { render, screen } from '@testing-library/react'
import Loading from '../index'

describe('Loading Component', () => {
  it('should render loading spinner', () => {
    render(<Loading />)
    
    const loadingElement = screen.getByRole('progressbar')
    expect(loadingElement).toBeInTheDocument()
  })

  it('should render with custom message when provided', () => {
    render(<Loading message="Carregando posts..." />)
    
    expect(screen.getByText('Carregando posts...')).toBeInTheDocument()
  })

  it('should render default message when not provided', () => {
    render(<Loading />)
    
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  it('should apply correct styling classes', () => {
    const { container } = render(<Loading />)
    
    expect(container.firstChild).toHaveClass('loading-container')
  })
})
