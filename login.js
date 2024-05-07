const express = require("express");

module.exports = () => {
  const router = new SignupRouter();
  router.post("/signup", ExpressRouterAdapter.adapt(router));
};

class ExpressRouterAdapter {
  static adapt(router) {
    return async (req, res) => {
      const httpRequest = {
        body: req.body,
      };
      const httpResponse = await router.rout(httpRequest);
      res.status(httpResponse.statusCode).send(httpResponse.body);
    };
  }
}

// Presentation Layer
// signup-router
class SignupRouter {
  async route(httpRequest) {
    const { email, password, repeatPassword } = httpRequest.body;
    const user = new SignupUseCase().signUp({
      email,
      password,
      repeatPassword,
    });
    return {
      statusCode: 200,
      body: user,
    };
  }
}

// Domain Layer
// signup-usecase
class SignupUseCase {
  async signUp({ email, password, repeatPassword }) {
    if (password === repeatPassword) {
      new AddAccountRepository().add({ email, password });
    }
  }
}

// Infra Layer
// account-repo
const mongoose = require("mongoose");
const AccountModel = mongoose.model("Account");

class AddAccountRepository {
  async add({ email, password }) {
    const user = await AccountModel.create({ email, password });
    return user;
  }
}
