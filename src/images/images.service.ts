// images.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ImagesService {
  private s3: S3;

  constructor(private readonly imagesRepository: Repository<Image>) {
    this.s3 = new S3();
  }

  async uploadImage(file: Express.Multer.File): Promise<Image> {
    const { originalname } = file;
    const bucketName = 'my-bucket';
    const filename = `${uuid()}-${originalname}`;
    const fileStream = file.buffer;
    const uploadParams = {
      Bucket: bucketName,
      Body: fileStream,
      Key: filename,
    };

    await this.s3.upload(uploadParams).promise();

    const imageUrl = `https://${bucketName}.s3.amazonaws.com/${filename}`;

    const image = this.imagesRepository.create({
      filename,
      url: imageUrl,
    });

    return this.imagesRepository.save(image);
  }
}
