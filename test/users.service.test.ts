import { fetchUsers } from '../src/services/users.service';

describe('fetchUsers', () => {
  it('returns a user list with the expected structure', async () => {
    const users = await fetchUsers();

    expect(Array.isArray(users)).toBe(true);
    expect(users).toHaveLength(1);
    expect(users[0]).toEqual({ id: 1, name: 'Rakesh' });
  });
});
