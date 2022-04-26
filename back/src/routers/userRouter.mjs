import is from "@sindresorhus/is";
import { Router } from "express";
import { login_required } from "../middlewares/login_required.mjs";
import { userAuthService } from "../services/userService.mjs";

const userAuthRouter = Router();

userAuthRouter.post("/users/register", async function (req, res, next) {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요",
      );
    }

    // req (request) 에서 데이터 가져오기
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    // 위 데이터를 유저 db에 추가하기
    const newUser = await userAuthService.addUser({
      name,
      email,
      password,
    });

    if (newUser.errorMessage) {
      throw new Error(newUser.errorMessage);
    }

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

userAuthRouter.post("/users/login", async function (req, res, next) {
  try {
    // req (request) 에서 데이터 가져오기
    const email = req.body.email;
    const password = req.body.password;

    // 위 데이터를 이용하여 유저 db에서 유저 찾기
    const user = await userAuthService.getUser({ email, password });

    if (user.errorMessage) {
      throw new Error(user.errorMessage);
    }

    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
});

userAuthRouter.get(
  "/users/current",
  login_required,
  async function (req, res, next) {
    try {
      // jwt토큰에서 추출된 사용자 id를 가지고 db에서 사용자 정보를 찾음.
      const id = req.currentUserId;
      const currentUserInfo = await userAuthService.getUserInfo({
        id,
      });

      if (currentUserInfo.errorMessage) {
        throw new Error(currentUserInfo.errorMessage);
      }

      res.status(200).send(currentUserInfo);
    } catch (error) {
      next(error);
    }
  },
);

userAuthRouter.put("/users", login_required, async function (req, res, next) {
  try {
    // 현재 로그인된 사용자 id를 추출함.
    const id = req.currentUserId;
    // body data 로부터 업데이트할 사용자 정보를 추출함.
    let toUpdate = {};

    const name = req.body.name ?? null;
    if (name) {
      toUpdate = { ...toUpdate, name };
    }
    const email = req.body.email ?? null;
    if (email) {
      toUpdate = { ...toUpdate, email };
    }
    const password = req.body.password ?? null;
    if (password) {
      toUpdate = { ...toUpdate, password };
    }

    // 해당 사용자 아이디로 사용자 정보를 db에서 찾아 업데이트함.
    const updatedUser = await userAuthService.setUser({ id, toUpdate });

    if (updatedUser.errorMessage) {
      throw new Error(updatedUser.errorMessage);
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
});

userAuthRouter.get(
  "/users/:id",
  login_required,
  async function (req, res, next) {
    try {
      const id = req.params.id;
      const currentUserInfo = await userAuthService.getUserInfo({ id });

      if (currentUserInfo.errorMessage) {
        throw new Error(currentUserInfo.errorMessage);
      }

      res.status(200).send(currentUserInfo);
    } catch (error) {
      next(error);
    }
  },
);

userAuthRouter.delete("/users", login_required, async (req, res, next) => {
  try {
    // 현재 로그인된 사용자 id를 추출함.
    const id = req.currentUserId;

    // 해당 사용자 아이디로 사용자 정보를 db에서 찾아 삭제함.
    const deletedUser = await userAuthService.deleteUser({ id });

    if (deletedUser.errorMessage) {
      throw new Error(deletedUser.errorMessage);
    }

    res.status(200).json(deletedUser);
  } catch (error) {
    next(error);
  }
});

export { userAuthRouter };