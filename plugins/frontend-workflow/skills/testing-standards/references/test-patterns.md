# Canonical test patterns

## renderWithProviders (src/test/render.tsx)

```tsx
export function renderWithProviders(ui: ReactElement, options?: RenderOptions) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
    options,
  );
}
```

## MSW: shared server, per-test overrides

```tsx
// src/test/server.ts — started once in src/test/setup.ts
export const server = setupServer(...defaultHandlers);

// In a test: override only what this case needs
server.use(
  http.get('/api/appointments', () => HttpResponse.json({ items: [] })), // empty state
);
server.use(
  http.get('/api/appointments', () => HttpResponse.error()), // network failure
);
```

Never mock `fetch`, axios, or React Query itself — the network boundary is the contract.

## Accessibility assertion (vitest-axe)

```tsx
import { axe } from 'vitest-axe';

it('has no axe violations', async () => {
  const { container } = renderWithProviders(<DatePicker label="Appointment date" />);
  expect(await axe(container)).toHaveNoViolations();
});
```

## Keyboard interaction with userEvent

```tsx
it('closes on Escape and restores focus to the trigger', async () => {
  const user = userEvent.setup();
  renderWithProviders(<DatePicker label="Appointment date" />);

  const trigger = screen.getByRole('button', { name: /appointment date/i });
  await user.click(trigger);
  expect(screen.getByRole('dialog')).toBeInTheDocument();

  await user.keyboard('{Escape}');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});
```

## Async: findBy / waitFor, never timeouts

```tsx
expect(await screen.findByRole('alert')).toHaveTextContent(/could not load/i);
// not: await new Promise(r => setTimeout(r, 500))
```

## Integration test shape (screen-level, per AC)

```tsx
describe('AppointmentsScreen', () => {
  it('lets the user book an appointment (AC-1)', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AppointmentsScreen />);

    await user.click(await screen.findByRole('button', { name: /new appointment/i }));
    await user.type(screen.getByLabelText(/date/i), '2026-07-01');
    await user.click(screen.getByRole('button', { name: /confirm/i }));

    expect(await screen.findByRole('status')).toHaveTextContent(/booked/i);
  });
});
```
