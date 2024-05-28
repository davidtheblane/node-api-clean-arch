const MissingParamError = require('../../utils/errors/missing-param-error');
const UpdateAccessTokenRepository = require('./update-access-token-repository')
const MongoHelper = require('../helpers/mongo-helper')
let db;

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new UpdateAccessTokenRepository(userModel)

  return {
    userModel,
    sut,
  }
}

describe('UpdateAccessToken Repository', () => {
  beforeAll(async () => {
    db = await MongoHelper.connect(process.env.MONGO_URL)  
     // db = MongoHelper.db()
   });
 
   beforeEach(async () => {
     await db.collection('users').deleteMany();
   });
 
   afterAll(async () => {
     await MongoHelper.disconnect();
   });
   
  test('Should update the user with the given access token', async()=> {
    const {sut, userModel} = makeSut();
    const fakeUser = await userModel.insertOne({
      email: 'valid_email@mail.com',
      name: 'any_name',
      age: 35,
      state: 'any_state',
      password: 'hashed_password'
    })
    await sut.update(fakeUser.insertedId, 'valid_token')
    const updatedFakeUser = await userModel.findOne({
      _id: fakeUser.insertedId
    })
    expect(updatedFakeUser.accessToken).toBe('valid_token')
  })

  test("Should throw if no userModel is provided", async () => {
    const sut = new UpdateAccessTokenRepository()
    const promise = sut.update('valid_userId', 'valid_token')
    await expect(promise).rejects.toThrow()
  })

  test("Should throw if no params are provided", async () => {
    const {sut, userModel} = makeSut()
    const fakeUser = await userModel.insertOne({
      email: 'valid_email@mail.com',
      name: 'any_name',
      age: 35,
      state: 'any_state',
      password: 'hashed_password'
    })
    await expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
    await expect(sut.update(fakeUser.insertedId)).rejects.toThrow(new MissingParamError('accessToken'))

  })
})