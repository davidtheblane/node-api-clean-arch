const MongoHelper = require('../helpers/mongo-helper')
let db;

class UpdateAccessTokenRepository{
  constructor(userModel){
    this.userModel = userModel
  }

  async update(userId, accessToken){
    await this.userModel.updateOne({
      _id: userId
    }, {
      $set: {
        accessToken
      }
    })
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
    const userModel = db.collection('users')
    const sut = new UpdateAccessTokenRepository(userModel)
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
})