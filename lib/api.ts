const apiRoutes = {
  services: {
    github: {
      users: (searchTerm: string, page = 1) =>
        `/api/v1/services/github/users?q=${encodeURIComponent(
          searchTerm
        )}&page=${page}`
    }
  }
};

export default apiRoutes;
