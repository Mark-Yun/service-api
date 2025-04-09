import Book from '../../../models/Book.js';
import { getSignedUrlByUrl, getSignedUrlByKey, listBooksInBucket } from '../../../utils/s3.js';

function generateSignedUrls(sourceFiles) {
    return sourceFiles.map((url) => getSignedUrlByUrl(url));
}

export const resolvers = {
    Query: {
        getBookById: async (_, { id }) => Book.findById(id),
        getBooksByTopic: async (_, { topicId }) => Book.find({ topicIds: topicId }),
        findBooksInBucket: async (_, { prefix }) => {
            return await listBooksInBucket(prefix);
        },
    },
    Mutation: {
        createBook: async (_, { input }) => {
            const book = new Book(input);
            await book.save();
            return book;
        },
        updateBook: async (_, { input }) => {
            const { id, ...rest } = input;
            return await Book.findByIdAndUpdate(id, rest, { new: true });
        },
        deleteBook: async (_, { id }) => {
            const result = await Book.findByIdAndDelete(id);
            return result !== null;
        },
    },
    Book: {
        title: (parent, { language }) => parent.title?.[language] || parent.title?.['ko'] || '',
        signedUrls: async (parent) => await generateSignedUrls(parent.sourceFiles),
    },
    BookInBucket: {
        signedUrl: async (parent) => await getSignedUrlByKey(process.env.BOOK_BUCKET_NAME, parent.key)
    },
};