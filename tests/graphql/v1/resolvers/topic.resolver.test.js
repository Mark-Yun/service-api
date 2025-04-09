import { jest } from '@jest/globals';

jest.mock('@models/Topic.js', () => ({
    __esModule: true,
    default: Object.assign(jest.fn(), {
        findById: jest.fn(),
        find: jest.fn(),
        findByIdAndDelete: jest.fn(),
    }),
}));

import Topic from '@models/Topic.js';
import { resolvers } from '@graphql/v1/resolvers/topic.resolver.js';
const mockConstructor = jest.fn();

describe('Topic Resolvers', () => {
    describe('Query.getTopicById', () => {
        it('should return a topic by ID', async () => {
            const mockTopic = { _id: '1', name: 'Test Topic' };
            Topic.findById.mockResolvedValue(mockTopic);

            const result = await resolvers.Query.getTopicById(null, { id: '1' });

            expect(Topic.findById).toHaveBeenCalledWith('1');
            expect(result).toEqual(mockTopic);
        });
    });

    describe('Query.getTopicsByParent', () => {
        it('should return topics by parent ID', async () => {
            const mockTopics = [
                { _id: '1', name: 'Child Topic 1' },
                { _id: '2', name: 'Child Topic 2' },
            ];
            Topic.find.mockResolvedValue(mockTopics);

            const result = await resolvers.Query.getTopicsByParent(null, { parentId: '123' });

            expect(Topic.find).toHaveBeenCalledWith({ parentTopic: '123' });
            expect(result).toEqual(mockTopics);
        });
    });

    describe('Mutation.createTopic', () => {
        it('should create a new topic', async () => {
            const mockSave = jest.fn();
            const mockTopicInstance = {
                _id: '1',
                name: 'New Topic',
                description: 'Description',
                parentTopicId: null,
                tags: ['tag1'],
                save: mockSave,
            };

            Topic.mockImplementation(() => mockTopicInstance);
            mockSave.mockResolvedValue(mockTopicInstance);

            const result = await resolvers.Mutation.createTopic(null, {
                name: 'New Topic',
                description: 'Description',
                parentTopicId: null,
                tags: ['tag1'],
            });

            expect(result).toEqual(mockTopicInstance);
        });
    });

    describe('Mutation.deleteTopic', () => {
        it('should delete a topic by ID', async () => {
            Topic.findByIdAndDelete.mockResolvedValue(true);

            const result = await resolvers.Mutation.deleteTopic(null, { id: '1' });

            expect(Topic.findByIdAndDelete).toHaveBeenCalledWith('1');
            expect(result).toBe(true);
        });
    });
});
