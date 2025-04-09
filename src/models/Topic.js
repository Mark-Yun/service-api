import mongoose from 'mongoose';
// import openai from '../lib/openai.js';   // ← OpenAI SDK 래퍼 (apiKey 포함)

const DIM = 1536;                       // text‑embedding‑3‑small 기준

const topicSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        tags: [{
            type: String,
            trim: true,
        }],
        parentTopic: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Topic',
            default: null,
        },
        childTopics: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Topic',
        }],
        /* ---------- embedding 추가 ---------- */
        embedding: {
            type: [Number],                      // double 배열
            validate: v => v.length === DIM,
            default: () => Array(DIM).fill(0),   // 길이 1536로 초기화
        },
    },
    { timestamps: true }
);

// /* ---------- ① 임베딩 자동 생성 훅 ---------- */
// topicSchema.pre('save', async function (next) {
//     // name/description이 새로 들어오거나 수정될 때만 임베딩 생성
//     if (this.isNew || this.isModified('name') || this.isModified('description')) {
//         try {
//             const prompt = `${this.name}\n\n${this.description ?? ''}`.trim();
//             const { data } = await openai.embeddings.create({
//                 model: 'text-embedding-3-small',
//                 input: prompt,
//             });
//             this.embedding = data[0].embedding;   // 1536‑D 벡터
//         } catch (err) {
//             return next(err);                     // 에러를 체인으로 전달
//         }
//     }
//     next();
// });

/* ---------- ② 부모‑자식 연결 훅 (기존 로직) ---------- */
topicSchema.pre('save', function (next) {
    if (this.parentTopic) {
        mongoose.model('Topic').findByIdAndUpdate(
            this.parentTopic,
            { $addToSet: { childTopics: this._id } }, // 중복 방지를 위해 $push → $addToSet 권장
            { new: true },
            next
        );
    } else {
        next();
    }
});

export default mongoose.model('Topic', topicSchema);
