const LoginRouter = require('./login-router')
const { UnauthorizedError, ServerError } = require('../errors')
const { InvalidParamError, MissingParamError } = require('../../utils/errors')

const makeSut = () => {
  const authUseCaseSpy = makeAuthUseCase();
  const emailValidatorSpy = makeEmailValidator();
  authUseCaseSpy.accessToken = 'valid_token';
  const sut = new LoginRouter({
   authUseCase: authUseCaseSpy, 
   emailValidator: emailValidatorSpy
  });
  return{
    sut,
    authUseCaseSpy,
    emailValidatorSpy,
  }
}

const makeEmailValidator = () => {
  class EmailValidatorSpy {
    isValid(email) {
      this.email = email
      return this.isEmailValid
    }
  }
  const emailValidatorSpy =  new EmailValidatorSpy()
  emailValidatorSpy.isEmailValid = true;
  return emailValidatorSpy
}

const makeEmailValidatorWithError = () => {
  class EmailValidatorSpy {
     isValid(){
      throw new Error()
    }
  };

  return new EmailValidatorSpy();
}


const makeAuthUseCase = () => {
  class AuthUseCaseSpy {
   async auth (email, password) {
      this.email = email
      this.password = password
      return this.accessToken
    }
  }
  return new AuthUseCaseSpy();
}

const makeAuthUseCaseWithError = () => {
  class AuthUseCaseSpy {
    async auth(){
      throw new Error()
    }
  };

  return new AuthUseCaseSpy();
}

describe("LoginRouter", () => {
  test("Should return 400 if no email is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email').message);

  });

  test("Should return 400 if no password is provided", async () => {
    const {sut} = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    
    expect(httpResponse.body).toBe(new MissingParamError('password').message);
  });

  test("Should return 500 if no httpRequest is provided", async () => {
    const {sut} = makeSut();
    const httpResponse = await sut.route();
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body.error).toBe(new ServerError().message);

  });

  test("Should return 500 if httpRequest has no body", async () => {
    const {sut} = makeSut();
    const httpRequest = {}
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body.error).toBe(new ServerError().message);
  });

  test("Should call authUseCase with correct params", async () => {
    const {sut, authUseCaseSpy} = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
      }
    }
    sut.route(httpRequest);
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password);

  });

  test("Should return 401 when invalid credentials are provided", async () => {
    const {sut, authUseCaseSpy} = makeSut();
    authUseCaseSpy.accessToken = null;
    const httpRequest = {
      body: {
        email: 'invalid_email@mail.com',
        password: 'invalid_password',
      }
    }
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body.error).toBe(new UnauthorizedError().message);
  });

  test("Should return 200 when valid credentials are provided", async () => {
    const {sut, authUseCaseSpy} = makeSut();
    const httpRequest = {
      body: {
        email: 'valid_email@mail.com',
        password: 'valid_password',
      }
    }
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken);
  });

  test("Should return 400 if invalid email is provided", async () => {
    const {sut, emailValidatorSpy} = makeSut();
    emailValidatorSpy.isEmailValid = false;
    const httpRequest = {
      body: {
        email: 'invalid_email@mail.com',
        password: 'any_password2'
      }
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toBe(new InvalidParamError('email').message);
  });

test("Should call emailValidator with correct email", async () => {
  const {sut, emailValidatorSpy} = makeSut();
  const httpRequest = {
    body: {
      email: 'any_email@mail.com',
      password: 'any_password',
    }
  }
  sut.route(httpRequest);
  expect(emailValidatorSpy.email).toBe(httpRequest.body.email);
});

test('Should throw if invalid dependecies are provided', async () => {
  const invalid = {}
  const authUseCase = makeAuthUseCase()
  const suts = [].concat(
    new LoginRouter(),
    new LoginRouter({}),
    new LoginRouter({
      authUseCase: invalid,
    }),
    new LoginRouter({
      authUseCase,
    }),
    new LoginRouter({
      authUseCase,
      emailValidator: invalid
    }),
  )
  for(const sut of suts){
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
      }
    }
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body.error).toBe(new ServerError().message);
  }   
})


test('Should throw if dependecy throws', async () => {
  const authUseCase = makeAuthUseCase()
  const suts = [].concat(
  new LoginRouter({
    authUseCase: makeAuthUseCaseWithError(),
  }),
  new LoginRouter({
    authUseCase,
    emailValidator: makeEmailValidatorWithError()
  }),
);

    for(const sut of suts){
      const httpRequest = {
        body: {
          email: 'any_email@mail.com',
          password: 'any_password',
        }
      }
      const httpResponse = await sut.route(httpRequest);
      expect(httpResponse.statusCode).toBe(500);
      expect(httpResponse.body.error).toBe(new ServerError().message);
    }     
})


});
