import { render, screen } from '@testing-library/react'
import EmptyState from '../index'

describe('EmptyState Component', () => {
  it('should render with title and message', () => {
    render(
      <EmptyState 
        title="Nenhum Post Encontrado"
        message="Não há posts disponíveis no momento."
      />
    )
    
    expect(screen.getByText('Nenhum Post Encontrado')).toBeInTheDocument()
    expect(screen.getByText('Não há posts disponíveis no momento.')).toBeInTheDocument()
  })

  it('should render without message when not provided', () => {
    render(<EmptyState title="Sem Dados" />)
    
    expect(screen.getByText('Sem Dados')).toBeInTheDocument()
  })

  it('should render icon', () => {
    const { container } = render(<EmptyState title="Test" />)
    
    const icon = container.querySelector('svg')
    expect(icon).toBeInTheDocument()
  })

  it('should apply correct styling classes', () => {
    const { container } = render(<EmptyState title="Test" />)
    
    expect(container.firstChild).toHaveClass('empty-state')
  })
})
