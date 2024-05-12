const { MissingParamError } = require('../../utils/errors/index')
const AuthUseCase = require('./auth-use-case')

const makeSut = () => {
  class LoadUserByEmailRepositorySpy {
    async load(email) {
      this.email = email
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
  const sut = new AuthUseCase(loadUserByEmailRepositorySpy)
  return {
    sut,
    loadUserByEmailRepositorySpy
  }
}


describe('Auth Usecase', () => {

  test('Should throw if no email is provided', async () => {
    const { sut } = makeSut();
    const promise = sut.auth()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('Should throw if no password is provided', async () => {
    const { sut } = makeSut();
    const promise = sut.auth('any_email@mail.com')
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  test('should call loadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut();
    sut.auth('any_email@mail.com', 'any_password')
    expect(loadUserByEmailRepositorySpy.email).toBe('any_email@mail.com')
  })

  test('Should throw if no loadUserByEmailRepository is provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth('any_email@mail.com', 'any_password')
    expect(promise).rejects.toThrow()
  })

  test('Should throw if loadUserByEmailRepository has no load method', async () => {
    const sut = new AuthUseCase({})
    const promise = sut.auth('any_email@mail.com', 'any_password')
    expect(promise).rejects.toThrow()
  })

  test('Should return null if loadUserByEmailRepository returns null', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut();
    const accessToken = await sut.auth('invalid_email@mail.com', 'any_password')
    expect(accessToken).toBe(null)
  })

})