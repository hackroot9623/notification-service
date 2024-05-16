import db from "../conections";
import { listUsers } from "../controllers/users";
import { Request, Response } from "express";

describe("listUsers", () => {
  it("should return a list of users", async () => {
    const mockUsers = [
      { id: 1, name: "User 1" },
      { id: 2, name: "User 2" },
    ];
    db.user.findMany = jest.fn().mockResolvedValue(mockUsers);

    const req = {} as Request;
    const res = {
      json: jest.fn(),
    } as unknown as Response;

    await listUsers(req, res);

    expect(res.json).toHaveBeenCalledWith(mockUsers);
  });
});
