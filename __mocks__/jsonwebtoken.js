module.exports = {
  token: 'any_token',
  secret: '',
  id: '',
  
  sign (id, secret) {
    this.id = id
    this.secret = secret
    return this.token
  }
}