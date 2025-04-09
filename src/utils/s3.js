import { S3Client, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl as awsGetSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';

dotenv.config();

// 개발 환경에서만 AWS 설정 로깅
if (process.env.NODE_ENV === 'dev') {
    console.log('AWS Configuration:', {
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ? '***' : undefined,
        bucketName: process.env.BOOK_BUCKET_NAME,
    });
}

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

/**
 * S3 URL에서 버킷명과 키 추출
 * @param {string} url - 전체 S3 URL (ex: https://bucket.s3.amazonaws.com/key)
 * @returns {{ Bucket: string, Key: string }}
 */
function parseS3Url(url) {
    const match = url.match(/^https?:\/\/([^\\.]+)\.s3(?:[.-][a-z0-9-]+)?\.amazonaws\.com\/(.+)$/);
    if (!match) throw new Error(`Invalid S3 URL: ${url}`);
    return {
        Bucket: match[1],
        Key: match[2],
    };
}

export async function getSignedUrlByUrl(url) {
    const { Bucket, Key } = parseS3Url(url);

    const command = new GetObjectCommand({ Bucket, Key });
    const signedUrl = await awsGetSignedUrl(s3, command, { expiresIn: 3600 }); // 1시간 유효

    return signedUrl;
}

export async function getSignedUrlByKey(bucket, key) {
    if (!bucket || !key) {
        throw new Error('Bucket and key are required');
    }

    if (process.env.NODE_ENV === 'development') {
        console.log('Generating signed URL for:', {
            bucket,
            key,
            expiresIn: '1 hour'
        });
    }

    const command = new GetObjectCommand({ 
        Bucket: bucket,
        Key: key
    });

    try {
        const signedUrl = await awsGetSignedUrl(s3, command, { expiresIn: 3600 }); // 1시간 유효
        return signedUrl;
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Error in getSignedUrlByKey:', {
                bucket,
                key,
                error: {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                }
            });
        }
        throw error;
    }
}

export async function listBooksInBucket(prefix = "") {
    console.log('listBooksInBucket called with prefix:', prefix);
    console.log('BOOK_BUCKET_NAME:', process.env.BOOK_BUCKET_NAME);

    const bucket = process.env.BOOK_BUCKET_NAME;
    if (!bucket) {
        throw new Error('BOOK_BUCKET_NAME is not defined in environment variables');
    }

    const command = new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
    });

    console.log('Sending ListObjectsV2Command with params:', {
        Bucket: bucket,
        Prefix: prefix,
    });

    const result = await s3.send(command);
    console.log('ListObjectsV2Command result:', {
        contentsCount: result.Contents?.length || 0,
        isTruncated: result.IsTruncated,
    });

    return (result.Contents || []).map((item) => ({
        key: item.Key,
        lastModified: item.LastModified,
        size: item.Size,
    }));
} 