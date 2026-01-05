import { render, screen } from '@testing-library/react'
import ErrorMessage from '../index'

describe('ErrorMessage Component', () => {
  it('should render error message', () => {
    render(<ErrorMessage message="Erro ao carregar dados" />)
    
    expect(screen.getByText('Erro ao carregar dados')).toBeInTheDocument()
  })

  it('should render error icon', () => {
    const { container } = render(<ErrorMessage message="Test error" />)
    
    const icon = container.querySelector('svg')
    expect(icon).toBeInTheDocument()
  })

  it('should apply correct styling classes', () => {
    const { container } = render(<ErrorMessage message="Test" />)
    
    expect(container.firstChild).toHaveClass('error-container')
  })

  it('should handle long error messages', () => {
    const longMessage = 'Este é um erro muito longo que deve ser exibido corretamente no componente de erro'
    render(<ErrorMessage message={longMessage} />)
    
    expect(screen.getByText(longMessage)).toBeInTheDocument()
  })
})
