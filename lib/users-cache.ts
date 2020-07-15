import NodeCache from 'node-cache';

const UsersCache = new NodeCache({ stdTTL: 1000, checkperiod: 120 });

export default UsersCache;
