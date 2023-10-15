import request from 'supertest';
import faker from '@faker-js/faker';
import mongoose from 'mongoose';
import moment from 'moment';
import httpStatus from 'http-status';
import config from '../../config/config';
import app from '../../app';
import { TaskPriority, TaskStatus } from './task.interface';
import { tokenService, tokenTypes } from '../token';
import { User } from '../user';
import setupTestDB from '../jest/setupTestDB';

setupTestDB();

describe('createTask', () => {
    let adminAccessToken: string;
    let userAccessToken: string;
    let userOne: any;
    let admin: any;

    beforeEach(async () => {
        userOne = {
            _id: new mongoose.Types.ObjectId(),
            name: faker.name.firstName(),
            email: faker.internet.email().toLowerCase(),
            password: 'password123',
            role: 'regular',
            isEmailVerified: false,
        };

        admin = {
            _id: new mongoose.Types.ObjectId(),
            name: faker.name.findName(),
            email: faker.internet.email().toLowerCase(),
            password: 'adminPassword123', 
            role: 'admin',
            isEmailVerified: false,
        };

        await User.insertMany([userOne, admin]);
        const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
        adminAccessToken = tokenService.generateToken(admin._id, accessTokenExpires, tokenTypes.ACCESS);
        userAccessToken = tokenService.generateToken(userOne._id, accessTokenExpires, tokenTypes.ACCESS);
    });

    describe('POST /v1/tasks', () => {
        test('should return 201 and successfully create new task if data is ok', async () => {
            const newTask = {
                title: faker.random.alphaNumeric(15),
                description: faker.lorem.paragraph(1),
                priority: TaskPriority.medium,
                status: TaskStatus.To_Do,
                assignee: admin._id,
                assignedTo: userOne._id,
            };

            const res = await request(app)
                .post('/v1/tasks')
                .set('Authorization', `Bearer ${adminAccessToken}`)
                .send(newTask)
                .expect(httpStatus.CREATED);

            expect(res.body).toEqual({
                id: expect.any(String),
                title: newTask.title,
                description: newTask.description,
                priority: newTask.priority,
                status: newTask.status,
                assignee: newTask.assignee.toString(), 
                assignedTo: newTask.assignedTo.toString()
            });
        });
    });
});
