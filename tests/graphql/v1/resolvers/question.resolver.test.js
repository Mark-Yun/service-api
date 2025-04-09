import { jest } from '@jest/globals';

jest.mock('@models/Question.js', () => ({
    __esModule: true,
    default: Object.assign(jest.fn(), {
        findById: jest.fn(),
        find: jest.fn(),
        findByIdAndDelete: jest.fn(),
    }),
}));

import Question from '@models/Question.js';
import { resolvers } from '@graphql/v1/resolvers/question.resolver.js';

describe('Question Resolvers', () => {
    describe('Query.getQuestionById', () => {
        it('should return a question by ID', async () => {
            const mockQuestion = { _id: '1', text: { en: 'Test Question' } };
            Question.findById.mockResolvedValue(mockQuestion);

            const result = await resolvers.Query.getQuestionById(null, { id: '1' });

            expect(Question.findById).toHaveBeenCalledWith('1');
            expect(result).toEqual(mockQuestion);
        });
    });

    describe('Query.getQuestionsByTags', () => {
        it('should return questions filtered by tags', async () => {
            const mockQuestions = [
                { _id: '1', tags: ['tag1'] },
                { _id: '2', tags: ['tag2'] },
            ];
            const mockQuery = {
                limit: jest.fn().mockReturnThis(),               // limit() → same obj
                skip: jest.fn().mockResolvedValue(mockQuestions) // skip() → Promise
            };
            Question.find.mockReturnValue(mockQuery);

            const result = await resolvers.Query.getQuestionsByTags(null, { tags: ['tag1', 'tag2'] });

            expect(Question.find).toHaveBeenCalledWith({ tags: { $in: ['tag1', 'tag2'] } });
            expect(result).toEqual(mockQuestions);
        });
    });

    describe('Mutation.createQuestion', () => {
        it('should create a new question', async () => {
            const mockSave = jest.fn();
            const mockQuestionInstance = {
                _id: '1',
                text: { en: 'New Question' },
                answer: { en: 'Answer' },
                options: [{ en: 'Option 1' }],
                type: 'multiple-choice',
                difficulty: 5,
                tags: ['tag1'],
                save: mockSave,
            };

            Question.mockImplementation(() => mockQuestionInstance);
            mockSave.mockResolvedValue(mockQuestionInstance);

            const result = await resolvers.Mutation.createQuestion(null, {
                text: { en: 'New Question' },
                answer: { en: 'Answer' },
                options: [{ en: 'Option 1' }],
                type: 'multiple-choice',
                difficulty: 5,
                tags: ['tag1'],
            });

            expect(result).toEqual(mockQuestionInstance);
        });
    });

    describe('Mutation.deleteQuestion', () => {
        it('should delete a question by ID', async () => {
            Question.findByIdAndDelete.mockResolvedValue(true);

            const result = await resolvers.Mutation.deleteQuestion(null, { id: '1' });

            expect(Question.findByIdAndDelete).toHaveBeenCalledWith('1');
            expect(result).toBe(true);
        });
    });
});