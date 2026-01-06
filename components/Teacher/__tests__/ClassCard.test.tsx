import { render, screen, fireEvent } from '@testing-library/react'
import ClassCard from '../ClassCard'

describe('ClassCard Component', () => {
  const mockOnDelete = jest.fn()
  const defaultProps = {
    id: '1',
    classNumber: 'Matemática',
    teacher: 'Prof. João',
    classTitle: 'Introdução à Álgebra',
    classImage: '/test-image.jpg',
    link: '/edit/1',
    onDelete: mockOnDelete,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render all props correctly', () => {
    render(<ClassCard {...defaultProps} />)
    
    expect(screen.getByText('Matemática')).toBeInTheDocument()
    expect(screen.getByText('Prof. João')).toBeInTheDocument()
    expect(screen.getByText('Introdução à Álgebra')).toBeInTheDocument()
  })

  it('should render image with correct src', () => {
    render(<ClassCard {...defaultProps} />)
    
    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('src', expect.stringContaining('test-image.jpg'))
  })

  it('should call onDelete when delete button is clicked', () => {
    render(<ClassCard {...defaultProps} />)
    
    const deleteButton = screen.getByLabelText(/delete|excluir/i)
    fireEvent.click(deleteButton)
    
    expect(mockOnDelete).toHaveBeenCalledTimes(1)
  })

  it('should have edit link with correct href', () => {
    render(<ClassCard {...defaultProps} />)
    
    const editLink = screen.getByRole('link', { name: /edit|editar/i })
    expect(editLink).toHaveAttribute('href', '/edit/1')
  })

  it('should handle missing image gracefully', () => {
    const propsWithoutImage = { ...defaultProps, classImage: '' }
    render(<ClassCard {...propsWithoutImage} />)
    
    const image = screen.getByRole('img')
    expect(image).toBeInTheDocument()
  })
})
