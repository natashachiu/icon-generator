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
    accessKeyId: process.env.ACCESS_KEY ?? "",
    secretAccessKey: process.env.SECRET_ACCESS_KEY ?? "",
  },
  region: "us-east-1"
});
const BUCKET_NAME = 'icon-generator-icons';



async function generateIcon(prompt: string, numIcons: number) {
  if (process.env.MOCK_OPENAI === 'true') {
    return new Array(numIcons).fill(b64Img);
  } else {
    const response = await openai.images.generate({
      prompt,
      n: numIcons,
      size: "1024x1024",
      response_format: "b64_json"
    });
    return response.data.map(res => res.b64_json || "");
  }
}


export const generateRouter = createTRPCRouter({
  generateIcon: protectedProcedure
    .input(
      z.object({
        prompt: z.string(),
        color: z.string(),
        style: z.string(),
        numIcons: z.number().min(1).max(10),
      }))

    .mutation(async ({ ctx, input }) => {
      const inputPrompt = `icon of ${input.prompt}, ${input.style} material, 3D render on ${input.color} background, high quality, unreal engine graphics quality`;
      const images_base64 = await generateIcon(inputPrompt, input.numIcons);

      const icons = await Promise.all(images_base64.map(async img => {
        const icon = await ctx.prisma.icon.create({
          data: {
            prompt: input.prompt,
            userId: ctx.session.user.id,
          }
        });
        await s3.putObject({
          Bucket: BUCKET_NAME,
          Body: Buffer.from(img, "base64"),
          Key: icon.id,
          ContentEncoding: "base64",
          ContentType: "image/png"
        })
          .promise();

        return icon;
      }));

      return icons.map(icon => {
        return {
          imageUrl: `https://${BUCKET_NAME}.s3.us-east-2.amazonaws.com/${icon.id}`,
        };
      });

    })
});


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