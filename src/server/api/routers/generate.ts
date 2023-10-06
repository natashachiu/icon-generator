import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import OpenAI from "openai";
import { b64Img } from "~/data/b64Image";
import AWS from "aws-sdk";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
  region: "us-east-1"
});

async function generateIcon(prompt: string): Promise<string | undefined> {
  if (process.env.MOCK_OPENAI === 'true') {
    return b64Img;
  } else {
    const response = await openai.images.generate({
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json"
    });
    return response.data[0]?.b64_json;
  }
}
export const generateRouter = createTRPCRouter({

  generateIcon: protectedProcedure
    .input(
      z.object({
        prompt: z.string(),
      }))
    .mutation(async ({ ctx, input }) => {

      // const { count } = await ctx.prisma.user.updateMany({
      //   where: {
      //     id: ctx.session.user.id,
      //     credits: {
      //       gte: 1
      //     },
      //   },
      //   data: {
      //     credits: {
      //       decrement: 1
      //     }
      //   }
      // });
      // if (count <= 0) {
      //   throw new TRPCError({
      //     code: 'BAD_REQUEST',
      //     message: 'you do not have enough credits'
      //   });
      // }


      const image_base64 = await generateIcon(input.prompt);

      const icon = await ctx.prisma.icon.create({
        data: {
          prompt: input.prompt,
          userId: ctx.session.user.id,
        }
      });

      await s3.putObject({
        Bucket: 'icon-generator-icons',
        Body: Buffer.from(image_base64!, "base64"),
        Key: icon.id,
        ContentEncoding: "base64",
        ContentType: "image/png"
      })
        .promise();


      return {
        imageUrl: image_base64,
      };
    })
});
