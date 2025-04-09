// models/graphql/QuestionResolvers.js
import Question from '../../../models/Question.js';

export const resolvers = {
    Query: {
        getQuestionById: (_, { id }) => Question.findById(id),

        getQuestionsByTags: async (_, { tags, limit = 10, skip = 0 }) => {
            if (!tags?.length) return [];
            return Question.find({ tags: { $in: tags } }).limit(limit).skip(skip);
        },
    },

    Mutation: {
        createQuestion: async (_, { text, answer, options, type, difficulty, tags }) => {
            try {
                const question = new Question({ text, answer, options, type, difficulty, tags });
                await question.save();
                return question;
            } catch (err) {
                throw new Error(`Failed to create question: ${err.message}`);
            }
        },

        updateQuestion: async (_, { id, text, answer, options, type, difficulty, tags }) => {
            const updated = await Question.findByIdAndUpdate(
                id,
                { text, answer, options, type, difficulty, tags },
                { new: true }
            );
            if (!updated) throw new Error('Question not found');
            return updated;
        },

        deleteQuestion: async (_, { id }) => {
            const result = await Question.findByIdAndDelete(id);
            return result !== null;
        }
    },

    Question: {
        text: (parent, { language }) => parent.getTextByLanguage(language),
        answer: (parent, { language }) => parent.getAnswerByLanguage(language),
        options: (parent, { language }) => parent.getOptionsByLanguage(language),
    }
};
