jest.mock('validator', () => ({
  isEmailValid: true,
  email: '',
  
  isEmail (email) {
    this.email = email
    return this.isEmailValid
  }
})) 

const EmailValidator = require('./email-validator');
const validator = require('validator');
const MissingParamError = require('../errors/missing-param-error');

const makeSut = () => {
  return new EmailValidator()
}

describe("EmailValidator", () => {

  test("Should return true if validator returns true", () => {
    const sut = makeSut()
    const isEmailValid = sut.isValid('valid_email@mail.com')
    expect(isEmailValid).toBe(true)
  })

  test("Should return false if validator returns false", () => {
    validator.isEmailValid = false
    const sut = makeSut()
    const isEmailValid = sut.isValid('invalid_email@mail.com')
    expect(isEmailValid).toBe(false)
  })

  test("Should callvalidator with correct email", () => {
    const sut = makeSut()
    sut.isValid('valid_email@mail.com')
    expect(validator.email).toBe('valid_email@mail.com')
  })  

   test("Should throw if no email is provided", async () => {
    const sut = makeSut()
    // quando funcao não é assincrona, deve-se usar o expect(()=>{}).toThrow()
    expect(() => {sut.isValid()}).toThrow(new MissingParamError('email'));
   })

})