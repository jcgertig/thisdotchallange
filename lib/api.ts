const apiRoutes = {
  services: {
    github: {
      users: (searchTerm: string) =>
        `/api/v1/services/github/users?q=${encodeURIComponent(searchTerm)}`
    }
  }
};

export default apiRoutes;
