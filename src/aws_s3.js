import { S3Client, PutObjectCommand, ListObjectsCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { AWS_BUCKET_REGION, AWS_PUBLIC_KEY, AWS_SECRET_KEY, AWS_BUCKET_NAME } from './config.js';
import fs from 'fs';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';

const client = new S3Client({
    region: AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: AWS_PUBLIC_KEY,
        secretAccessKey: AWS_SECRET_KEY
    }
});

function getExt(archivo) {
    const partes = archivo.split('.');
    if (partes.length === 1 || (partes[0] === '' && partes.length === 2)) {
        return '';
    }
    return partes.pop().toLowerCase();
};


async function getFileURL(filename) {
    const command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: filename
    })
    return await getSignedUrl(client, command, { expiresIn: 86400 })
};

export async function uploadFile(file) {
    const fileExtension = await getExt(file.name);
    const key = `image-${Date.now()}` + `.${fileExtension}`;
    const stream = fs.createReadStream(file.tempFilePath);
    const uploadParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: key,
        Body: stream
    };
    const command = new PutObjectCommand(uploadParams);
    await client.send(command);
    return getFileURL(key);
};