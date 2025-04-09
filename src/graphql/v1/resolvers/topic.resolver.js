// models/graphql/TopicResolvers.js
import Topic from '../../../models/Topic.js';

export const resolvers = {
    Query: {
        getTopicById: (_, { id }) => Topic.findById(id),
        getTopicsByParent: (_, { parentId }) => Topic.find({ parentTopic: parentId }),
        getTopicsByTags: async (_, { tags, limit = 10, skip = 0 }) => {
            if (!tags?.length) return [];
            return await Topic.find({ tags: { $in: tags } }).limit(limit).skip(skip);
        }
    },

    Mutation: {
        createTopic: async (_, { name, description, parentTopicId, tags }) => {
            try {
                const topic = new Topic({ name, description, parentTopic: parentTopicId, tags });
                await topic.save();
                return topic;
            } catch (err) {
                throw new Error(`Failed to create topic: ${err.message}`);
            }
        },

        updateTopic: async (_, { id, name, description, parentTopicId, tags }) => {
            const updated = await Topic.findByIdAndUpdate(
                id,
                { name, description, parentTopic: parentTopicId, tags },
                { new: true }
            );
            if (!updated) throw new Error('Topic not found');
            return updated;
        },

        deleteTopic: async (_, { id }) => {
            const result = await Topic.findByIdAndDelete(id);
            return result !== null;
        }
    },

    Topic: {
        name: (parent) => parent.name,
        description: (parent) => parent.description,
        childTopics: (parent) => Topic.find({ parentTopic: parent._id }),
        parentTopic: (parent) => parent.parentTopic ? Topic.findById(parent.parentTopic) : null
    }
    ,
};
