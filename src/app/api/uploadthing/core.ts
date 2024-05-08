import { createUploadthing, type FileRouter } from "uploadthing/next";

import { currentUser } from "@/lib/auth";
 
const f = createUploadthing();
 
const handleAuth = async () => {
  const user = await currentUser();

  if (!user?.id) throw new Error("Unauthorized");
  return { user: user.id };
}

export const ourFileRouter = {
  portfolioAttachment: f({ pdf: { maxFileSize: '4MB' } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;