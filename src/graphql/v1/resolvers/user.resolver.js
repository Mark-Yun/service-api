export default {
    Query: {
        me: () => ({
            id: '1',
            name: 'Alice',
            email: 'alice@example.com',
        }),
        healthCheck: () => 'OK!',
    },
};
