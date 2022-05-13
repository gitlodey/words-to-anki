class Http {
  async get(url: string, options: RequestInit | undefined) {
    try {
      const response = await fetch(url, options);
      return await response.json();
    } catch (err) {
      alert(err);
    }
  }
}

export default new Http();
