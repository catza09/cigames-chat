var chai = require("chai");
var chaiHttp = require("chai-http");
const server = require("../server");
//Assertion style

chai.should();

chai.use(chaiHttp);


describe("Task API", () => {

    /**
     * Testare ruta GET 
     */
    describe("GET /", () => {
        it("Trebuie sa returneze pagina de start", (done) => {
            chai.request(server).get("/").end((err, response) => {
                response.should.have.status(200);
                done();
            })
        })


    });



    /**
     * Testare ruta POST pentru autentificare
     */
    describe("POST /signup", () => {
        it("Trebuie sa trimita datele de conectare", (done) => {
            const task = {
                username: "disertatietest",
                email: "disertatietest@cigames.ro",
                password: ""
            };
            chai.request(server).post("/signup").send(task).end((err, response) => {
                response.should.have.status(200);
                done();
            })
        })


    });


});