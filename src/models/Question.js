// models/Question.js
import mongoose from 'mongoose';

// 질문(Question) 모델
const QuestionSchema = new mongoose.Schema(
    {
        // 질문 텍스트 (다국어 지원을 위해 각 언어별로 저장)
        text: {
            type: Map,
            of: String,
            required: true,  // 다국어로 텍스트를 제공
        },
        answer: {
            type: Map,
            of: String,
            required: true,  // 각 언어에 대한 답변
        },
        options: [
            {
                type: Map,
                of: String,  // 객관식 선택지 (각 언어별로)
            }
        ],
        type: {
            type: String,
            enum: ['multiple-choice', 'open-ended'], // 문제 유형 (객관식, 주관식)
            required: true,
        },
        difficulty: {
            type: Number,  // 난이도 (1~10000)
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        tags: [{ type: String }],  // 태그 (예: 과목, 학년 등)
    },
    { timestamps: true }
);

// 다국어 텍스트를 처리하는 메서드 (특정 언어로 텍스트와 답변을 가져올 수 있도록)
QuestionSchema.methods.getTextByLanguage = function (languageCode) {
    return this.text.get(languageCode) || this.text.get('ko');  // 기본값은 한국어
};

QuestionSchema.methods.getAnswerByLanguage = function (languageCode) {
    return this.answer.get(languageCode) || this.answer.get('ko');  // 기본값은 한국어
};

QuestionSchema.methods.getOptionsByLanguage = function (languageCode) {
    return this.options.map(option => option.get(languageCode) || option.get('ko')); // 선택지의 기본값은 한국어
};

export default mongoose.model('Question', QuestionSchema);