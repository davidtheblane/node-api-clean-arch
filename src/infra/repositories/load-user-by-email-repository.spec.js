const { MongoClient } = require('mongodb')

class LoadUserByEmailRepository{
  constructor (userModel){
    this.userModel = userModel
  }

  async load(email){
    const user = await this.userModel.findOne({email})
    return user
  }
}

describe("LoadUserByEmail Repository", () => {
  let client;
  let db;

  beforeAll(async () => {
    client = await MongoClient.connect(process.env.MONGO_URL, {})  
    db = client.db()
  });

  beforeEach(async () => {
    await db.collection('users').deleteMany();
  });

  afterAll(async () => {
    await client.close();
  });

  const makeSut = (userModel) => {
    const sut = new LoadUserByEmailRepository(userModel)
    return sut
  }


  test("Should return null if no user is found", async () => {
  const userModel = db.collection('users')
    const sut = makeSut(userModel)
    const user = await sut.load('invalid_email@mail.com')
    expect(user).toBeNull()
  })

  test("Should return an user if user is found", async () => {
  const userModel = db.collection('users')
  await userModel.insertOne({
    email: 'valid_email@mail.com'
  })
    const sut = makeSut(userModel)
    const user = await sut.load('valid_email@mail.com')
    expect(user.email).toBe('valid_email@mail.com')
  })
})