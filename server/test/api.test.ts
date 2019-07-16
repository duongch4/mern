import supertest from "supertest";
import { ExpressServer } from "../ExpressServer";

describe(
    "GET /api",
    () => {
        it(
            "should return 200 OK",
            () => {
                return supertest(new ExpressServer().getApp()).get("/api/more/myMes").expect(200);
            }
        );
    }
);
