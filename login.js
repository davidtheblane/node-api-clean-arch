module.exports = () => {
  router.post("/signup", new SignupRouter().route);
};

// sign-router
const express = require("express");
const router = express.Router();

class SignupRouter {
  async route(req, res) {
    const { email, password, repeatPassword } = req.body;
    new SignupUseCase().signUp({ email, password, repeatPassword });
    res.status(400).send({ error: "password must be equal" });
  }
}

// signup-usecase
class SignupUseCase {
  async signUp({ email, password, repeatPassword }) {
    if (password === repeatPassword) {
      new AddAccountRepository().add({ email, password });
    }
  }
}

// account-repo
const mongoose = require("mongoose");
const AccountModel = mongoose.model("Account");

class AddAccountRepository {
  async add({ email, password }) {
    const user = await AccountModel.create({ email, password });
    return user;
  }
}
