const MongoHelper = require('../helpers/mongo-helper')
const LoadUserByEmailRepository = require('./load-user-by-email-repository')
const MissingParamError = require('../../utils/errors/missing-param-error')
let userModel;

describe("LoadUserByEmail Repository", () => {
  beforeAll(async () => {
   await MongoHelper.connect(process.env.MONGO_URL)
   userModel = await MongoHelper.getCollection('users')
  });

  beforeEach(async () => {
    await userModel.deleteMany();
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  const makeSut = () => {
    return new LoadUserByEmailRepository()
  }

  test("Should return null if no user is found", async () => {
    const sut = makeSut()
    const user = await sut.load('invalid_email@mail.com')
    expect(user).toBeNull()
  })

  test("Should return an user if user is found", async () => {
  const sut = makeSut()
  const fakeUser = await userModel.insertOne({
    email: 'valid_email@mail.com',
    name: 'any_name',
    age: 35,
    state: 'any_state',
    password: 'hashed_password'
  })
    const user = await sut.load('valid_email@mail.com')
    expect(user._id).toEqual(fakeUser.insertedId)
  })

  test("Should throw if no email is provided", async () => {
    const sut = makeSut()
    const promise = sut.load()
    await expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

})