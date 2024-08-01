import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET() {
  try {
    // Authenticate with Google API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL!,
        private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/documents.readonly"],
    });

    const docs = google.docs({ version: "v1", auth });
    const documentId = process.env.GOOGLE_DOC_ID!;

    // Fetch the document
    const response = await docs.documents.get({ documentId });

    if (!response.data.body) {
      throw new Error("No content found in the document");
    }

    const content = response.data.body.content
      ?.map((item) => {
        if (item.paragraph) {
          return item.paragraph.elements
            ?.map((el) => el.textRun?.content)
            .join("");
        }
        return "";
      })
      .join("\n");

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Failed to fetch template:", error);

    return NextResponse.json(
      { error: "Failed to fetch template" },
      { status: 500 }
    );
  }
}
