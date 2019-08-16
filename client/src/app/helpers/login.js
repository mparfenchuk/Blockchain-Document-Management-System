const login = (token, history) => {
    localStorage.setItem('token', token);
    history.push('/profile');
}

export default login