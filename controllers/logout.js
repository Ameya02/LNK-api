function logout(req, res) {
    res.clearCookie('cookieName');
    res.locals = {};
    
}
