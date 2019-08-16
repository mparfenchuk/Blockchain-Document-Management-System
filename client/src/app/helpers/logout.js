const logout = async (client, history) => {
    await client.clearStore();
    localStorage.removeItem('token');
    history.push('/login');
}

export default logout