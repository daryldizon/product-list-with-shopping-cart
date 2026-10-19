import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReactModal from 'react-modal';
import { beforeEach, expect, test, vi } from 'vitest';
import App from './App';

vi.mock('sweetalert2', () => ({
  default: { mixin: () => ({ fire: vi.fn() }), stopTimer: vi.fn(), resumeTimer: vi.fn() },
}));

const CSV = `id,display_name,barcode,price,brand,category
1,Tuna Can,111,20.50,555,Canned Seafood
2,Sardines Can,222,15.25,555,Canned Seafood
3,Shampoo,333,99.00,Sunsilk,Hair Care
`;

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal('fetch', vi.fn(async () => new Response(CSV)));
  ReactModal.setAppElement(document.createElement('div'));
});

test('lists products and filters by search', async () => {
  const user = userEvent.setup();
  render(<App />);

  expect(await screen.findByText('Tuna Can')).toBeInTheDocument();
  expect(screen.getByText('1 - 3 of 3')).toBeInTheDocument();

  await user.type(screen.getByLabelText('Search Product:'), 'sun');
  expect(screen.queryByText('Tuna Can')).not.toBeInTheDocument();
  expect(screen.getByText('Shampoo')).toBeInTheDocument();
});

test('filters by category and clears search', async () => {
  const user = userEvent.setup();
  render(<App />);
  await screen.findByText('Tuna Can');

  await user.type(screen.getByLabelText('Search Product:'), 'xyz');
  expect(screen.getByText('No product found!')).toBeInTheDocument();

  await user.selectOptions(screen.getByLabelText('Categories:'), 'Hair Care');
  expect(screen.getByLabelText('Search Product:')).toHaveValue('');
  expect(screen.getByText('Shampoo')).toBeInTheDocument();
  expect(screen.queryByText('Tuna Can')).not.toBeInTheDocument();
});

test('adds items to the cart, merges quantities and persists them', async () => {
  const user = userEvent.setup();
  render(<App />);
  const row = (await screen.findByText('Tuna Can')).closest('tr');

  await user.click(within(row).getByLabelText('Increase quantity'));
  await user.click(within(row).getByRole('button', { name: 'Add to Cart' }));
  await user.click(within(row).getByRole('button', { name: 'Add to Cart' }));

  expect(screen.getByRole('button', { name: 'View Cart (4)' })).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem('ShoppingCart'))).toEqual([
    expect.objectContaining({ id: '1', quantity: 4 }),
  ]);

  await user.click(screen.getByRole('button', { name: 'View Cart (4)' }));
  const dialog = screen.getByRole('dialog');
  expect(within(dialog).getAllByText('₱82.00')).toHaveLength(2);
});

test('decrementing a cart item at quantity 1 removes it', async () => {
  localStorage.setItem(
    'ShoppingCart',
    JSON.stringify([{ id: '3', display_name: 'Shampoo', price: '99.00', brand: 'Sunsilk', category: 'Hair Care', quantity: '1' }]),
  );
  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByRole('button', { name: 'View Cart (1)' }));
  await user.click(within(screen.getByRole('dialog')).getByLabelText('Decrease quantity'));

  expect(screen.getByText('Your shopping cart is empty.')).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem('ShoppingCart'))).toEqual([]);
});

test('paginates products and resets to page 1 when page size changes', async () => {
  const rows = Array.from({ length: 25 }, (_, i) => `${i + 1},Item ${i + 1},0,1.00,Brand,Cat`);
  const csv = ['id,display_name,barcode,price,brand,category', ...rows].join('\n');
  fetch.mockImplementation(async () => new Response(csv));
  const user = userEvent.setup();
  render(<App />);
  await screen.findByText('Item 1');

  expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
  await user.click(screen.getByLabelText('Increase page'));
  await user.click(screen.getByLabelText('Increase page'));
  await user.click(screen.getByLabelText('Increase page'));
  expect(screen.getByText('Page 3 of 3')).toBeInTheDocument();
  expect(screen.getByText('21 - 25 of 25')).toBeInTheDocument();

  await user.selectOptions(screen.getByLabelText('Page Item:'), '20');
  expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
});

test('quantity field can be cleared and retyped', async () => {
  const user = userEvent.setup();
  render(<App />);
  const row = (await screen.findByText('Tuna Can')).closest('tr');
  const input = within(row).getByLabelText('quantity');

  await user.clear(input);
  await user.type(input, '5');
  await user.click(within(row).getByRole('button', { name: 'Add to Cart' }));

  expect(screen.getByRole('button', { name: 'View Cart (5)' })).toBeInTheDocument();
});
