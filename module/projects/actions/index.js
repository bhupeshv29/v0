
"use server";


import db, { prisma } from "@/lib/db";
import { consumeCredits } from "@/lib/usage";
import { getCurrentUser } from "@/module/auth/actions";

import { inngest } from "@/src/inngest/client";
import { MessageRole, MessageType } from "@prisma/client";
import { generateSlug } from "random-word-slugs";

export const createProject = async (value) => {
  const user = await getCurrentUser();

  if (!user) throw new Error("Unauthorized");



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

  const newProject = await prisma.project.create({
    data: {
      name: generateSlug(2, { format: "kebab" }),
      userId: user.id,
      messages: {
        create: {
          content: value,
          role: MessageRole.USER,
          type: MessageType.RESULT,
        },
      },
    },
  });

  await inngest.send({
    name: "code-agent/run",
    data: {
      value: value,
      projectId: newProject.id,
    },
  });

  return newProject;
};

export const getProjects = async () => {
  const user = await getCurrentUser();

  if (!user) throw new Error("Unauthorized");

  const projects = await prisma.project.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return projects;
};

export const getProjectById = async (projectId) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
      userId: user.id,
    },
  });

  if (!project) throw new Error("Project not found");

  return project;
};
