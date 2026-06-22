// Template: copy next to the component as <Name>.test.tsx and fill in.
// Sections marked TODO are the minimum bar for an interactive component.
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '@/test/render';
// import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('renders with required props', () => {
    // TODO: render and assert the accessible role/name is present
    // renderWithProviders(<ComponentName label="..." />);
    // expect(screen.getByRole('...', { name: /.../i })).toBeInTheDocument();
  });

  it('handles primary interaction', async () => {
    const user = userEvent.setup();
    // TODO: drive the main behavior via user events; assert visible outcome
  });

  it('is fully keyboard operable', async () => {
    const user = userEvent.setup();
    // TODO: Tab to it, activate with Enter/Space, Esc where applicable,
    // assert focus is visible/managed (toHaveFocus)
  });

  it('has no axe violations', async () => {
    // TODO: const { container } = renderWithProviders(<ComponentName ... />);
    // expect(await axe(container)).toHaveNoViolations();
  });

  // TODO per design: disabled / loading / empty / error state tests
});
