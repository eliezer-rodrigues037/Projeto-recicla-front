import { render, screen } from '@testing-library/react'
import Main from '../src/pages'
import '@testing-library/jest-dom'

describe('Main', () => {
  it('renders', () => {
    render(<Main />)

    const stack = screen.getByRole('index/stack')

    expect(stack).toBeInTheDocument()
  })

  it('renders the correct text', () => {
    render(<Main />)

    const heading = screen.getByRole('index/heading')

    expect(heading).toHaveTextContent('Entre com suas credenciais')
  })
})