import request from 'supertest';
import faker from '@faker-js/faker';
import mongoose from 'mongoose';
import moment from 'moment';
import httpStatus from 'http-status';
import config from '../../config/config';
import app from '../../app';
import {  ITaskDoc, TaskPriority, TaskStatus } from './task.interface';
import { tokenService, tokenTypes } from '../token';
import { User } from '../user';
import setupTestDB from '../jest/setupTestDB';
import { logger } from '../logger';

setupTestDB();

describe('createTask', () => {
    let adminAccessToken: string;
    let userOne: any;
    let admin: any;
    let taskId: mongoose.Types.ObjectId | string = '';

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
    });

    describe('POST /v1/tasks', () => {
        test('should return 201 and successfully create new task if data is ok', async () => {
            const newTask = {
                title: faker.random.alphaNumeric(15),
                description: faker.lorem.paragraph(1),
                priority: TaskPriority.medium,
                status: TaskStatus.To_Do,
                dueDate:"2023-11-12T00:00:00.000Z",
                assignee: admin._id,
                assignedTo: userOne._id,
            };

            const res = await request(app)
                .post('/v1/tasks')
                .set('Authorization', `Bearer ${adminAccessToken}`)
                .send(newTask)
                .expect(httpStatus.CREATED);
            taskId = res.body.id;
            logger.info('task: '+res)
            expect(res.body).toEqual({
                id: expect.any(String),
                title: newTask.title,
                description: newTask.description,
                priority: newTask.priority,
                dueDate: newTask.dueDate,
                status: newTask.status,
                assignee: newTask.assignee.toString(), 
                assignedTo: newTask.assignedTo.toString()
            });
        });
    });
    describe('GET /v1/tasks', () => {
        test('should return 200 and apply the default query options', async () => {
            const res = await request(app)
                .get('/v1/tasks')
                .set('Authorization', `Bearer ${adminAccessToken}`)
                .send()
                .expect(httpStatus.OK);
            expect(res.body).toEqual({
                results: expect.arrayContaining<ITaskDoc>([]),
                page: 1,
                limit: 10,
                totalPages: expect.any(Number),
                totalResults: expect.any(Number),
            });
            expect(res.body.results[0]).toEqual({
                id: expect.any(String),
                title: expect.any(String),
                description: expect.any(String),
                priority: expect.any(String),
                status: expect.any(String),
                dueDate: expect.any(String),
                assignee: expect.any(Object),
                assignedTo: expect.any(Object),
            });
        });
    });
    describe('DELETE /v1/tasks', () => {
        test('should return 204 if task delete is successful', async () => {
            await request(app)
                .delete('/v1/tasks/'+ taskId)
                .set('Authorization', `Bearer ${adminAccessToken}`)
                .send()
                .expect(httpStatus.NO_CONTENT);
        });
    });
});
