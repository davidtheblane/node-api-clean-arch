const {MissingParamError} = require('../../utils/errors/index')
class AuthUseCase {
  async auth(email) {
    if(!email){
      throw new MissingParamError('email')
    }
  }
}


describe('Auth Usecase', () => {
  
  test('Should throw if no email is provided', async() => {
    const sut = new AuthUseCase()
    await expect(async () => {await sut.auth()}).rejects.toThrow(new MissingParamError('email'))

  }) 
  
})