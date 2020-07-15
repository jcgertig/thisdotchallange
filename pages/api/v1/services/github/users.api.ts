import fetch from 'node-fetch';

import UsersCache from '../../../../../lib/users-cache';

const noResult = {
  page: 0,
  totalPages: 0,
  items: [],
  total: 0
};

export default async function(req, res) {
  if (req.method === 'GET') {
    const { q, page = 1 } = req.query;
    // If we don't have a query return standard no result
    if (!q) {
      return res.json(noResult);
    }

    // Check cache
    const cacheKey = `${q}-${page}`;
    const cachedUsers = UsersCache.get(cacheKey);
    if (cachedUsers) {
      return res.json(cachedUsers);
    }

    // Get users list
    const queryRes = await fetch(
      `https://api.github.com/search/users?q=${q}${page ? `&page=${page}` : ''}`
    );
    const data = await queryRes.json();

    // Loop over users to fill them out with info
    const users: Array<any> = [];
    for (const user of data.items || []) {
      if (user.login) {
        const queryRes = await fetch(
          `https://api.github.com/users/${user.login}`
        );
        const userRes = await queryRes.json();
        users.push(userRes.message ? user : userRes);
      }
    }

    // cache the results
    const returnValue = {
      page,
      totalPages: Math.ceil(data.total_count / 30),
      items: users,
      total: data.total_count
    };
    UsersCache.set(cacheKey, returnValue);

    res.json(returnValue);
  }
}
