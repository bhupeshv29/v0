"use server";

import { MessageRole, MessageType } from "@prisma/client";
import  { prisma } from "@/lib/db";


import { consumeCredits } from "@/lib/usage";
import { inngest } from "@/src/inngest/client";
import { getCurrentUser } from "@/module/auth/actions";

export const createMessages = async (value, projectId) => {
  const user = await getCurrentUser();

  if (!user) throw new Error("Unauthorized");

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
      userId: user.id,
    },
  });

  if (!project) throw new Error("Project not found");


  try {
    await consumeCredits();
  } catch (error) {
      if(error instanceof Error) {
      throw new Error({
      code:"BAD_REQUEST",
        message:"Something went wrong"
      })
    }
    else{
      throw new Error({
        code:"TOO_MANY_REQUESTS",
        message:"Too many requests"
      })
    }
  }

  const newMessage = await prisma.message.create({
    data: {
      projectId: projectId,
      content: value,
      role: MessageRole.USER,
      type: MessageType.RESULT,
    },
  });

  await inngest.send({
    name: "code-agent/run",
    data: {
      value: value,
      projectId: projectId,
    },
  });

  return newMessage;
};

export const getMessages = async (projectId) => {
  const user = await getCurrentUser();

  if (!user) throw new Error("Unauthorized");

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
      userId: user.id,
    },
  });

  if (!project) throw new Error("Project not found or unauthorized");

  const messages = await prisma.message.findMany({
    where:{
        projectId
    },
    orderBy:{
        updatedAt:"asc"
    },
    include:{
        fragments:true
    }
  })

  return messages;
};