describe("LoadUserByEmail Repository", () => {
class LoadUserByEmailRepository{
  async load(email){
return null
  }
}

  const makeSut = () => {
    const sut = new LoadUserByEmailRepository()
    return sut
  }

  test("Should return null if no user is found", async () => {
    const sut = makeSut()
    const user = await sut.load('invalid_email@mail.com')
    expect(user).toBeNull()
  })
})