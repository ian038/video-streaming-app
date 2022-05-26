import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../model/user.schema';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest'
import { AppModule } from '../app.module';

describe('UserController', () => {
    let app: INestApplication
    let userData: User

    beforeEach(async () => {
        userData = {
            fullname: "abc",
            email: "abc@test.com",
            password: 'helloworld',
            createdDate: new Date(Date.now())
        }

        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile()

        app = module.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    })

    afterAll(async () => {
        await app.close();
    })

    describe('when signing up with valid data', () => {
        it('should respond with the data of the user without the password', async () => {
            const expectedData = {
                newUser: {
                    fullname: userData.fullname,
                    email: userData.email,
                    password: userData.password
                }
            }
            expectedData.newUser.password = null
            const res = await request(app.getHttpServer()).post('/api/user/signup').send({
                fullname: userData.fullname,
                email: userData.email,
                password: 'helloworld'
            })
            expect(res.status).toBe(201)
            expect(res.body).toMatchObject(expectedData)
        })
    })
})