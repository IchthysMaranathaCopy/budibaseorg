import { it, expect, describe, beforeEach, vi } from 'vitest'
import {render, fireEvent, screen} from '@testing-library/svelte'
import '@testing-library/jest-dom'

import EditableLabel from './EditableLabel.svelte'

describe('EditableLabel', () => {
  describe('type of "heading"', () => {
    beforeEach(() => {
      render(EditableLabel, { type: 'heading', value: "foo" })
    });

    it('renders a heading', (ctx) => {
      expect(screen.getByTestId('typography-heading')).toBeInTheDocument()
    });
  })

  describe('type of "body"', () => {
    beforeEach(() => {
      render(EditableLabel, { type: 'body' , value: "foo"})
    });

    it('renders a body', (ctx) => {
      expect(screen.getByTestId('typography-body')).toBeInTheDocument()
    });
  })

  describe('any other type', () => {
    beforeEach(() => {
      render(EditableLabel, { type: '' , value: "foo"})
    });

    it('renders a label', (ctx) => {
      expect(screen.getByTestId('label')).toBeInTheDocument()
    });
  })
})
