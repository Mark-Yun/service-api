import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    title: { type: Object, required: true },         // 다국어 제목
    authors: { type: [String], default: [] },        // 저자
    publisher: String,                               // 출판사
    publishedYear: Number,                           // 출판 연도
    isbn: String,                                     // ISBN
    tags: { type: [String], default: [] },           // 분류 태그

    // ✅ S3에 저장된 각 페이지의 URL 배열
    sourceFiles: {
        type: [String],
        default: [],
    },

    // ✅ 연결된 토픽
    topicIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
    }],
}, {
    timestamps: true, // createdAt, updatedAt 자동 생성
});

const Book = mongoose.model('Book', bookSchema);
export default Book;
